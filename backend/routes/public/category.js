const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        category_id,
        name,
        slug,
        description,
        is_bulk_only,
        steel_characteristics,
        sort_order,
        (
          SELECT COUNT(*)::int 
          FROM product_categories pc 
          WHERE pc.category_id = c.category_id
        ) as product_count
      FROM categories c
      WHERE is_active = true
      ORDER BY sort_order ASC, name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;