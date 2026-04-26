import express from 'express';
import { body, query as validQuery, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import fs from 'fs/promises';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const tags = req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : [];

    let queryText = `
      SELECT DISTINCT d.id, d.title, d.slug, d.category, d.description,
             d.created_at, d.updated_at, d.view_count, d.is_published,
             u.username as author_name,
             COALESCE(json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'color', t.color))
               FILTER (WHERE t.id IS NOT NULL), '[]') as tags
      FROM documents d
      LEFT JOIN users u ON d.author_id = u.id
      LEFT JOIN document_tags dt ON d.id = dt.document_id
      LEFT JOIN tags t ON dt.tag_id = t.id
      WHERE d.is_published = true
    `;

    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      queryText += ` AND d.category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      queryText += ` AND d.search_vector @@ plainto_tsquery('french', $${paramCount})`;
      params.push(search);
    }

    if (tags.length > 0) {
      paramCount++;
      queryText += ` AND EXISTS (
        SELECT 1 FROM document_tags dt2
        JOIN tags t2 ON dt2.tag_id = t2.id
        WHERE dt2.document_id = d.id AND t2.name = ANY($${paramCount})
      )`;
      params.push(tags);
    }

    queryText += ` GROUP BY d.id, u.username ORDER BY d.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    const countQuery = await query(
      `SELECT COUNT(DISTINCT d.id) as total FROM documents d
       LEFT JOIN document_tags dt ON d.id = dt.document_id
       LEFT JOIN tags t ON dt.tag_id = t.id
       WHERE d.is_published = true ${category ? 'AND d.category = $1' : ''}`,
      category ? [category] : []
    );

    res.json({
      documents: result.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countQuery.rows[0].total),
        pages: Math.ceil(countQuery.rows[0].total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT d.*, u.username as author_name,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'color', t.color))
          FILTER (WHERE t.id IS NOT NULL), '[]') as tags,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', rd.id, 'title', rd.title, 'slug', rd.slug))
          FILTER (WHERE rd.id IS NOT NULL), '[]') as related_documents
       FROM documents d
       LEFT JOIN users u ON d.author_id = u.id
       LEFT JOIN document_tags dt ON d.id = dt.document_id
       LEFT JOIN tags t ON dt.tag_id = t.id
       LEFT JOIN related_documents reldoc ON d.id = reldoc.document_id
       LEFT JOIN documents rd ON reldoc.related_document_id = rd.id
       WHERE d.id = $1
       GROUP BY d.id, u.username`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await query('UPDATE documents SET view_count = view_count + 1 WHERE id = $1', [id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/',
  authenticateToken,
  requireRole('admin', 'editor'),
  upload.single('file'),
  [
    body('title').trim().notEmpty(),
    body('category').isIn(['functional', 'technical', 'user']),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = await query('BEGIN', []);

    try {
      const { title, category, description, tags, is_external, external_url } = req.body;
      let content = req.body.content || '';
      let filePath = null;
      let fileType = null;

      if (req.file) {
        filePath = req.file.path;
        fileType = req.file.mimetype;

        // Seulement lire le contenu pour les fichiers texte
        const textFormats = ['text/plain', 'text/markdown', 'text/html', 'application/json', 'text/csv', 'text/xml'];
        if (textFormats.includes(req.file.mimetype)) {
          try {
            content = await fs.readFile(req.file.path, 'utf-8');
          } catch (error) {
            console.log('Could not read file as text, keeping user-provided content');
          }
        }
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const isExternal = is_external === 'true' || is_external === true;

      const result = await query(
        `INSERT INTO documents (title, slug, content, category, description, author_id, file_path, file_type, is_external, external_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [title, slug, content, category, description || null, req.user!.id, filePath, fileType, isExternal, external_url || null]
      );

      const document = result.rows[0];

      if (tags && Array.isArray(tags)) {
        for (const tagName of tags) {
          const tagResult = await query(
            'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
            [tagName]
          );
          await query(
            'INSERT INTO document_tags (document_id, tag_id) VALUES ($1, $2)',
            [document.id, tagResult.rows[0].id]
          );
        }
      }

      await query('COMMIT', []);
      res.status(201).json(document);
    } catch (error) {
      await query('ROLLBACK', []);
      console.error('Error creating document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.put(
  '/:id',
  authenticateToken,
  requireRole('admin', 'editor'),
  upload.single('file'),
  async (req: AuthRequest, res) => {
    const { id } = req.params;
    const client = await query('BEGIN', []);

    try {
      const { title, category, description, content, tags, is_external, external_url } = req.body;
      let updateContent = content;
      let filePath = null;
      let fileType = null;

      if (req.file) {
        filePath = req.file.path;
        fileType = req.file.mimetype;

        const textFormats = ['text/plain', 'text/markdown', 'text/html', 'application/json', 'text/csv', 'text/xml'];
        if (textFormats.includes(req.file.mimetype)) {
          try {
            updateContent = await fs.readFile(req.file.path, 'utf-8');
          } catch (error) {
            console.log('Could not read file as text, keeping user-provided content');
          }
        }
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 0;

      if (title) {
        paramCount++;
        updates.push(`title = $${paramCount}`);
        values.push(title);
        paramCount++;
        updates.push(`slug = $${paramCount}`);
        values.push(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
      }
      if (category) {
        paramCount++;
        updates.push(`category = $${paramCount}`);
        values.push(category);
      }
      if (description !== undefined) {
        paramCount++;
        updates.push(`description = $${paramCount}`);
        values.push(description);
      }
      if (updateContent) {
        paramCount++;
        updates.push(`content = $${paramCount}`);
        values.push(updateContent);
      }
      if (filePath) {
        paramCount++;
        updates.push(`file_path = $${paramCount}`);
        values.push(filePath);
        paramCount++;
        updates.push(`file_type = $${paramCount}`);
        values.push(fileType);
      }
      if (is_external !== undefined) {
        paramCount++;
        updates.push(`is_external = $${paramCount}`);
        values.push(is_external === 'true' || is_external === true);
      }
      if (external_url !== undefined) {
        paramCount++;
        updates.push(`external_url = $${paramCount}`);
        values.push(external_url || null);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      paramCount++;
      values.push(id);

      const result = await query(
        `UPDATE documents SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        await query('ROLLBACK', []);
        return res.status(404).json({ error: 'Document not found' });
      }

      if (tags) {
        await query('DELETE FROM document_tags WHERE document_id = $1', [id]);

        if (Array.isArray(tags)) {
          for (const tagName of tags) {
            const tagResult = await query(
              'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
              [tagName]
            );
            await query(
              'INSERT INTO document_tags (document_id, tag_id) VALUES ($1, $2)',
              [id, tagResult.rows[0].id]
            );
          }
        }
      }

      await query('COMMIT', []);
      res.json(result.rows[0]);
    } catch (error) {
      await query('ROLLBACK', []);
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin', 'editor'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const fileResult = await query('SELECT file_path FROM documents WHERE id = $1', [id]);

      const result = await query('DELETE FROM documents WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }

      if (fileResult.rows[0]?.file_path) {
        try {
          await fs.unlink(fileResult.rows[0].file_path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      }

      res.json({ message: 'Document deleted successfully' });
    } catch (error) {
      console.error('Error deleting document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
