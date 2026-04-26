import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT t.*, COUNT(dt.document_id) as document_count
       FROM tags t
       LEFT JOIN document_tags dt ON t.id = dt.tag_id
       GROUP BY t.id
       ORDER BY t.name ASC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/',
  authenticateToken,
  requireRole('admin', 'editor'),
  [
    body('name').trim().notEmpty(),
    body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, color } = req.body;

      const result = await query(
        'INSERT INTO tags (name, color) VALUES ($1, $2) RETURNING *',
        [name, color || '#3B82F6']
      );

      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Tag already exists' });
      }
      console.error('Error creating tag:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.json({ message: 'Tag deleted successfully' });
    } catch (error) {
      console.error('Error deleting tag:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
