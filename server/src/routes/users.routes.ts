import express from 'express';
import { body, validationResult } from 'express-validator';
import { query } from '../db/pool.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Liste tous les utilisateurs (admin uniquement)
router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await query(
      `SELECT id, username, email, role, created_at, updated_at
       FROM users
       ORDER BY created_at DESC`,
      []
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Créer un nouvel utilisateur (admin uniquement)
router.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  [
    body('username').trim().notEmpty().isLength({ min: 3, max: 50 }),
    body('email').trim().isEmail(),
    body('password').isLength({ min: 8 }),
    body('role').isIn(['admin', 'editor', 'user']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, email, password, role } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await query(
        'SELECT id FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const result = await query(
        `INSERT INTO users (username, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, email, role, created_at`,
        [username, email, hashedPassword, role]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Récupérer un utilisateur par ID (admin uniquement)
router.get('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT id, username, email, role, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mettre à jour un utilisateur (admin uniquement)
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  [
    body('username').optional().trim().isLength({ min: 3, max: 50 }),
    body('email').optional().trim().isEmail(),
    body('role').optional().isIn(['admin', 'editor', 'user']),
    body('password').optional().isLength({ min: 8 }),
  ],
  async (req: AuthRequest, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { username, email, role, password } = req.body;

      // Vérifier que l'utilisateur existe
      const userCheck = await query('SELECT id, role FROM users WHERE id = $1', [id]);
      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Empêcher un admin de se retirer ses propres droits admin
      if (id === req.user!.id && role && role !== 'admin') {
        return res.status(400).json({ error: 'Cannot remove your own admin role' });
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 0;

      if (username) {
        paramCount++;
        updates.push(`username = $${paramCount}`);
        values.push(username);
      }

      if (email) {
        paramCount++;
        updates.push(`email = $${paramCount}`);
        values.push(email);
      }

      if (role) {
        paramCount++;
        updates.push(`role = $${paramCount}`);
        values.push(role);
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        paramCount++;
        updates.push(`password = $${paramCount}`);
        values.push(hashedPassword);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      paramCount++;
      values.push(id);

      const result = await query(
        `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $${paramCount}
         RETURNING id, username, email, role, created_at, updated_at`,
        values
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Supprimer un utilisateur (admin uniquement)
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      // Empêcher un admin de se supprimer lui-même
      if (id === req.user!.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      const result = await query(
        'DELETE FROM users WHERE id = $1 RETURNING id, username',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
