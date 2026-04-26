import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/applications - Liste toutes les applications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, COUNT(d.id) as document_count
       FROM applications a
       LEFT JOIN documents d ON a.id = d.application_id
       GROUP BY a.id
       ORDER BY a.name ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/applications - Créer une nouvelle application (Admin/Editor)
router.post(
  '/',
  authenticateToken,
  requireRole('admin', 'editor'),
  [
    body('id').trim().notEmpty().isLength({ min: 2, max: 50 }).matches(/^[a-z0-9-]+$/),
    body('name').trim().notEmpty().isLength({ min: 2, max: 100 }),
    body('color').optional().matches(/^bg-[a-z]+-[0-9]+$/),
    body('icon').optional().trim().isLength({ max: 50 }),
    body('description').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id, name, color, icon, description } = req.body;

      const result = await query(
        `INSERT INTO applications (id, name, color, icon, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [id, name, color || 'bg-blue-500', icon || null, description || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Application ID already exists' });
      }
      console.error('Error creating application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/applications/:id - Modifier une application (Admin/Editor)
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin', 'editor'),
  [
    body('name').optional().trim().notEmpty().isLength({ min: 2, max: 100 }),
    body('color').optional().matches(/^bg-[a-z]+-[0-9]+$/),
    body('icon').optional().trim().isLength({ max: 50 }),
    body('description').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { name, color, icon, description } = req.body;

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (color !== undefined) {
        updates.push(`color = $${paramIndex++}`);
        values.push(color);
      }
      if (icon !== undefined) {
        updates.push(`icon = $${paramIndex++}`);
        values.push(icon);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(description);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      values.push(id);
      const result = await query(
        `UPDATE applications SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json(result.rows[0]);
    } catch (error: any) {
      console.error('Error updating application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/applications/:id - Supprimer une application (Admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Vérifier s'il y a des documents associés
      const docsCheck = await query(
        'SELECT COUNT(*) as count FROM documents WHERE application_id = $1',
        [id]
      );

      if (parseInt(docsCheck.rows[0].count) > 0) {
        return res.status(409).json({
          error: 'Cannot delete application with associated documents',
          document_count: parseInt(docsCheck.rows[0].count)
        });
      }

      const result = await query('DELETE FROM applications WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }

      res.json({ message: 'Application deleted successfully' });
    } catch (error) {
      console.error('Error deleting application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
