import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories - Liste toutes les catégories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, COUNT(d.id) as document_count
       FROM categories c
       LEFT JOIN documents d ON c.id = d.category_id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/categories - Créer une nouvelle catégorie (Admin/Editor)
router.post(
  '/',
  authenticateToken,
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty().isLength({ min: 2, max: 100 }),
    body('slug').trim().notEmpty().isLength({ min: 2, max: 100 }).matches(/^[a-z0-9-]+$/),
    body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
    body('icon').optional().trim().isLength({ max: 50 }),
    body('description').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, slug, color, icon, description } = req.body;

      const result = await query(
        `INSERT INTO categories (name, slug, color, icon, description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, slug, color || '#3B82F6', icon || null, description || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Category name or slug already exists' });
      }
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/categories/:id - Modifier une catégorie (Admin/Editor)
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin', 'editor'),
  [
    body('name').optional().trim().notEmpty().isLength({ min: 2, max: 100 }),
    body('slug').optional().trim().notEmpty().isLength({ min: 2, max: 100 }).matches(/^[a-z0-9-]+$/),
    body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
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
      const { name, slug, color, icon, description } = req.body;

      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        values.push(name);
      }
      if (slug !== undefined) {
        updates.push(`slug = $${paramIndex++}`);
        values.push(slug);
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
        `UPDATE categories SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Category name or slug already exists' });
      }
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/categories/:id - Supprimer une catégorie (Admin only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Vérifier s'il y a des documents associés
      const docsCheck = await query(
        'SELECT COUNT(*) as count FROM documents WHERE category_id = $1',
        [id]
      );

      if (parseInt(docsCheck.rows[0].count) > 0) {
        return res.status(409).json({
          error: 'Cannot delete category with associated documents',
          document_count: parseInt(docsCheck.rows[0].count)
        });
      }

      const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
