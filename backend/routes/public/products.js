const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET all users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY user_id');
    console.log('Users:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET all steel products
router.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM steel_products ORDER BY product_id');
    console.log('Products:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
