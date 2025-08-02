const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories ORDER BY sort_order ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', async (req, res) => {
  const { name, slug, description, is_bulk_only, steel_characteristics, sort_order, is_active } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO categories (name, slug, description, is_bulk_only, steel_characteristics, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, slug, description, is_bulk_only, steel_characteristics, sort_order, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, is_bulk_only, steel_characteristics, sort_order, is_active } = req.body;

  try {
    const result = await db.query(
      `UPDATE categories 
       SET name = $1, slug = $2, description = $3, is_bulk_only = $4, 
           steel_characteristics = $5, sort_order = $6, is_active = $7
       WHERE category_id = $8
       RETURNING *`,
      [name, slug, description, is_bulk_only, steel_characteristics, sort_order, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM categories WHERE category_id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;