const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/', async (req, res) => {
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    const {
      firebase_uid,
      email,
      firstName,
      lastName,
      phone,
      company,
      gst_number
    } = req.body;

    // Validate required fields with default values
    if (!firebase_uid || !email) {
      throw new Error('Firebase UID and email are required');
    }

    const result = await client.query(
      `INSERT INTO users (
        firebase_uid,
        email,
        full_name,
        phone,
        company_name,
        gst_number,
        role,
        is_active,
        last_login
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        firebase_uid,
        email,
        `${firstName || 'User'} ${lastName || ''}`.trim(),
        phone || '0000000000', // Default phone number if not provided
        company || null,
        gst_number || null,
        'client',
        true,
        new Date()
      ]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating user:', error);
    res.status(500).json({ 
      error: 'Failed to create user',
      details: error.message 
    });
  } finally {
    client.release();
  }
});

// Add this new route
router.get('/check/:firebaseUid', async (req, res) => {
  const client = await db.connect();
  
  try {
    const { firebaseUid } = req.params;
    
    const result = await client.query(
      'SELECT EXISTS(SELECT 1 FROM users WHERE firebase_uid = $1)',
      [firebaseUid]
    );

    res.json({ found: result.rows[0].exists });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Failed to check user' });
  } finally {
    client.release();
  }
});

module.exports = router;