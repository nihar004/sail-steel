const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/check-admin', async (req, res) => {
  try {
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check both admin status AND active status
    const result = await db.query(
      `SELECT role, is_active 
       FROM users 
       WHERE firebase_uid = $1`,
      [firebaseUid]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ 
        isAdmin: false,
        isActive: false 
      });
    }

    const user = result.rows[0];
    return res.status(200).json({ 
      isAdmin: user.role === 'admin' && user.is_active,
      isActive: user.is_active
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
