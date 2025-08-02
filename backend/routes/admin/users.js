const express = require('express');
const router = express.Router();
const db = require('../../db');

// Get all users with filters
router.get('/', async (req, res) => {
  try {
    const { 
      status, // active/inactive
      role,
      sortBy = 'created_at',
      order = 'DESC',
      limit = 10,
      offset = 0,
      timeframe // this_month, this_week, etc.
    } = req.query;

    let query = `
      SELECT user_id, firebase_uid, email, full_name, phone, 
      company_name, role, is_active,
      last_login, created_at
      FROM users
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 1;

    if (status) {
      query += ` AND is_active = $${paramCount}`;
      queryParams.push(status === 'active');
      paramCount++;
    }

    if (role) {
      query += ` AND role = $${paramCount}`;
      queryParams.push(role);
      paramCount++;
    }

    if (timeframe === 'this_month') {
      query += ` AND created_at >= date_trunc('month', CURRENT_DATE)`;
    }

    query += ` ORDER BY ${sortBy} ${order} LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    const result = await db.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Toggle user active status
router.patch('/:userId/toggle-status', async (req, res) => {
  const { userId } = req.params;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Get current user status
    const userResult = await client.query(
      'SELECT is_active FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const newStatus = !userResult.rows[0].is_active;

    // Update only in PostgreSQL 
    await client.query(
      `UPDATE users 
       SET is_active = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $2`,
      [newStatus, userId]
    );

    await client.query('COMMIT');
    res.json({ success: true, isActive: newStatus });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  } finally {
    client.release();
  }
});

// Add this new route for role management
router.patch('/:userId/role', async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // Verify the role is valid
    if (!['client', 'admin', 'logistics'].includes(role)) {
      throw new Error('Invalid role');
    }

    // Update role
    await client.query(
      `UPDATE users 
       SET role = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $2`,
      [role, userId]
    );

    await client.query('COMMIT');
    res.json({ success: true, role });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  } finally {
    client.release();
  }
});

// Update the stats endpoint to include more details
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT
        COUNT(*) FILTER (WHERE is_active = true) as active_users,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_this_month,
        COUNT(*) FILTER (WHERE role = 'client') as total_clients,
        COUNT(*) FILTER (WHERE role = 'logistics') as total_logistics,
        COUNT(*) FILTER (WHERE role = 'admin') as total_admins
      FROM users
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

module.exports = router;