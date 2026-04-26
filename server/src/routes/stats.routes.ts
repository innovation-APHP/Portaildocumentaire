import express from 'express';
import { query } from '../db/pool.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [totalDocs, totalCategories, totalTags, recentDocs] = await Promise.all([
      query('SELECT COUNT(*) as count FROM documents WHERE is_published = true'),
      query('SELECT category, COUNT(*) as count FROM documents WHERE is_published = true GROUP BY category'),
      query('SELECT COUNT(*) as count FROM tags'),
      query(`
        SELECT d.id, d.title, d.slug, d.category, d.created_at, u.username as author_name
        FROM documents d
        LEFT JOIN users u ON d.author_id = u.id
        WHERE d.is_published = true
        ORDER BY d.created_at DESC
        LIMIT 5
      `),
    ]);

    const categoryMap: Record<string, number> = {};
    totalCategories.rows.forEach((row) => {
      categoryMap[row.category] = parseInt(row.count);
    });

    res.json({
      totalDocuments: parseInt(totalDocs.rows[0].count),
      documentsByCategory: categoryMap,
      totalTags: parseInt(totalTags.rows[0].count),
      recentDocuments: recentDocs.rows,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
