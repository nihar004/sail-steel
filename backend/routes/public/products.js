const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET all steel products
router.get('/', async (req, res) => {
  try {
    // Update the SQL query to include all necessary fields
    const result = await db.query(`
      SELECT 
        p.product_id,
        p.name,
        p.description,
        p.price_per_unit,
        p.unit_of_measure,
        p.is_active,
        p.created_at,
        jsonb_build_object(
          'category_id', c.category_id,
          'name', c.name,
          'slug', c.slug,
          'description', c.description
        ) as category,
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object(
            'image_id', pi.image_id,
            'image_path', pi.image_path,
            'image_type', pi.image_type,
            'alt_text', pi.alt_text,
            'sort_order', pi.sort_order
          )) FILTER (WHERE pi.image_id IS NOT NULL),
          '[]'
        ) as images,
        COALESCE(
          jsonb_agg(DISTINCT jsonb_build_object(
            'document_id', pd.document_id,
            'document_type', pd.document_type,
            'file_path', pd.file_path,
            'reference_number', pd.reference_number
          )) FILTER (WHERE pd.document_id IS NOT NULL),
          '[]'
        ) as documents
      FROM steel_products p
      LEFT JOIN product_categories pc ON p.product_id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      LEFT JOIN product_documents pd ON p.product_id = pd.product_id
      WHERE p.is_active = true
      GROUP BY p.product_id, c.category_id, c.name, c.slug, c.description
      ORDER BY p.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
