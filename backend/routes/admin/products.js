const express = require('express');
const router = express.Router();
const db = require('../../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.*,
        jsonb_build_object(
          'type', p.dimensions->>'type',
          'dimensions', p.dimensions
        ) as formatted_dimensions,
        jsonb_build_object(
          'category_id', c.category_id,
          'name', c.name,
          'slug', c.slug
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
            'reference_number', pd.reference_number,
            'valid_until', pd.valid_until
          )) FILTER (WHERE pd.document_id IS NOT NULL),
          '[]'
        ) as documents
      FROM steel_products p
      LEFT JOIN product_categories pc ON p.product_id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      LEFT JOIN product_documents pd ON p.product_id = pd.product_id
      WHERE p.is_active = true
      GROUP BY p.product_id, c.category_id, c.name, c.slug
      ORDER BY p.created_at DESC
    `);

    const formattedProducts = result.rows.map(product => ({
      ...product,
      dimensions: product.dimensions,
      chemical_composition: product.chemical_composition,
      mechanical_properties: product.mechanical_properties,
      category: product.category || null,
      images: Array.isArray(product.images) ? product.images : [],
      documents: Array.isArray(product.documents) ? product.documents : []
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.post('/', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const {
      sku,
      name,
      description,
      grade,
      dimensions,
      weight_per_unit,
      unit_of_measure,
      minimum_order_qty,
      price_per_unit,
      hsn_code,
      heat_number,
      chemical_composition,
      mechanical_properties,
      is_active,
      category_id, // Change from selected_categories
      images,
      documents
    } = req.body;

    // Insert product
    const productResult = await client.query(`
      INSERT INTO steel_products (
        sku,
        name,
        description,
        grade,
        dimensions,
        weight_per_unit,
        unit_of_measure,
        minimum_order_qty,
        price_per_unit,
        hsn_code,
        heat_number,
        chemical_composition,
        mechanical_properties,
        is_active,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
      RETURNING product_id
    `, [
      sku,
      name,
      description,
      grade,
      dimensions,
      weight_per_unit,
      unit_of_measure,
      minimum_order_qty,
      price_per_unit,
      hsn_code,
      heat_number,
      chemical_composition,
      mechanical_properties,
      is_active
    ]);

    const productId = productResult.rows[0].product_id;

    // Insert single category
    if (category_id) {
      await client.query(`
        INSERT INTO product_categories (product_id, category_id)
        VALUES ($1, $2)
      `, [productId, category_id]);
    }

    // Insert images
    if (images?.length) {
      const imageValues = images.map((_, index) => 
        `($1, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, $${index * 4 + 5})`
      ).join(', ');
      
      await client.query(`
        INSERT INTO product_images (product_id, image_path, alt_text, sort_order, image_type)
        VALUES ${imageValues}
      `, [
        productId,
        ...images.flatMap(img => [
          img.image_path,
          img.alt_text || '',
          img.sort_order || 0,
          img.image_type || 'product' // Change default from 'primary' to 'product'
        ])
      ]);
    }

    // Insert documents
    if (documents?.length) {
      const documentValues = documents.map((_, index) => 
        `($1, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, $${index * 4 + 5})`
      ).join(', ');
      
      await client.query(`
        INSERT INTO product_documents (product_id, file_path, document_type, reference_number, valid_until)
        VALUES ${documentValues}
      `, [
        productId,
        ...documents.flatMap(doc => [
          doc.file_path,
          doc.document_type || 'mtr',
          doc.reference_number || null,
          doc.valid_until || null
        ])
      ]);
    }

    await client.query('COMMIT');

    // Fetch the complete product data to return
    const completeProduct = await client.query(`
      SELECT 
        p.*,
        jsonb_build_object(
          'category_id', c.category_id,
          'name', c.name
        ) as category,
        jsonb_agg(DISTINCT jsonb_build_object(
          'image_id', pi.image_id,
          'image_path', pi.image_path,
          'alt_text', pi.alt_text,
          'sort_order', pi.sort_order
        )) FILTER (WHERE pi.image_id IS NOT NULL) as images,
        jsonb_agg(DISTINCT jsonb_build_object(
          'document_id', pd.document_id,
          'file_path', pd.file_path,
          'document_type', pd.document_type,
          'reference_number', pd.reference_number
        )) FILTER (WHERE pd.document_id IS NOT NULL) as documents
      FROM steel_products p
      LEFT JOIN product_categories pc ON p.product_id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      LEFT JOIN product_documents pd ON p.product_id = pd.product_id
      WHERE p.product_id = $1
      GROUP BY p.product_id, c.category_id, c.name
    `, [productId]);

    res.status(201).json(completeProduct.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  } finally {
    client.release();
  }
});

router.delete('/:productId', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { productId } = req.params;

    // Delete product (cascade will handle related records)
    await client.query(
      'DELETE FROM steel_products WHERE product_id = $1',
      [productId]
    );

    await client.query('COMMIT');
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  } finally {
    client.release();
  }
});

router.patch('/:productId', async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { productId } = req.params;
    const {
      sku,
      name,
      description,
      grade,
      dimensions,
      weight_per_unit,
      unit_of_measure,
      minimum_order_qty,
      price_per_unit,
      hsn_code,
      heat_number,
      chemical_composition,
      mechanical_properties,
      is_active,
      category_id,
      images,
      documents
    } = req.body;

    // Update main product
    await client.query(`
      UPDATE steel_products SET
        sku = $1,
        name = $2,
        description = $3,
        grade = $4,
        dimensions = $5,
        weight_per_unit = $6,
        unit_of_measure = $7,
        minimum_order_qty = $8,
        price_per_unit = $9,
        hsn_code = $10,
        heat_number = $11,
        chemical_composition = $12,
        mechanical_properties = $13,
        is_active = $14,
        updated_at = NOW()
      WHERE product_id = $15
    `, [
      sku,
      name,
      description,
      grade,
      dimensions,
      weight_per_unit,
      unit_of_measure,
      minimum_order_qty,
      price_per_unit,
      hsn_code,
      heat_number,
      chemical_composition,
      mechanical_properties,
      is_active,
      productId
    ]);

    // Update category
    await client.query(`
      DELETE FROM product_categories WHERE product_id = $1;
    `, [productId]);

    if (category_id) {
      await client.query(`
        INSERT INTO product_categories (product_id, category_id)
        VALUES ($1, $2)
      `, [productId, category_id]);
    }

    // Update images
    if (images?.length) {
      await client.query(`DELETE FROM product_images WHERE product_id = $1`, [productId]);
      
      const imageValues = images.map((_, index) => 
        `($1, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, $${index * 4 + 5})`
      ).join(', ');
      
      await client.query(`
        INSERT INTO product_images (product_id, image_path, alt_text, sort_order, image_type)
        VALUES ${imageValues}
      `, [
        productId,
        ...images.flatMap(img => [
          img.image_path,
          img.alt_text || '',
          img.sort_order || 0,
          img.image_type || 'product'
        ])
      ]);
    }

    // Update documents
    if (documents?.length) {
      await client.query(`DELETE FROM product_documents WHERE product_id = $1`, [productId]);
      
      const documentValues = documents.map((_, index) => 
        `($1, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4}, $${index * 4 + 5})`
      ).join(', ');
      
      await client.query(`
        INSERT INTO product_documents (product_id, file_path, document_type, reference_number, valid_until)
        VALUES ${documentValues}
      `, [
        productId,
        ...documents.flatMap(doc => [
          doc.file_path,
          doc.document_type || 'mtr',
          doc.reference_number || null,
          doc.valid_until || null
        ])
      ]);
    }

    await client.query('COMMIT');

    // Fetch and return the updated product
    const result = await client.query(`
      SELECT 
        p.*,
        jsonb_build_object(
          'category_id', c.category_id,
          'name', c.name
        ) as category,
        jsonb_agg(DISTINCT jsonb_build_object(
          'image_id', pi.image_id,
          'image_path', pi.image_path,
          'alt_text', pi.alt_text,
          'sort_order', pi.sort_order
        )) FILTER (WHERE pi.image_id IS NOT NULL) as images,
        jsonb_agg(DISTINCT jsonb_build_object(
          'document_id', pd.document_id,
          'file_path', pd.file_path,
          'document_type', pd.document_type,
          'reference_number', pd.reference_number
        )) FILTER (WHERE pd.document_id IS NOT NULL) as documents
      FROM steel_products p
      LEFT JOIN product_categories pc ON p.product_id = pc.product_id
      LEFT JOIN categories c ON pc.category_id = c.category_id
      LEFT JOIN product_images pi ON p.product_id = pi.product_id
      LEFT JOIN product_documents pd ON p.product_id = pd.product_id
      WHERE p.product_id = $1
      GROUP BY p.product_id, c.category_id, c.name
    `, [productId]);

    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  } finally {
    client.release();
  }
});

module.exports = router;