const db = require('../db');

const adminAuthMiddleware = async (req, res, next) => {
  try {
    const firebaseUid = req.headers['firebase-uid'];

    if (!firebaseUid) {
      return res.status(401).json({ 
        error: 'Unauthorized - No Firebase UID provided' 
      });
    }

    // Check if user exists, is active, and is admin
    const result = await db.query(
      `SELECT role, is_active 
       FROM users 
       WHERE firebase_uid = $1`,
      [firebaseUid]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Unauthorized - User not found' 
      });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ 
        error: 'Forbidden - Account is inactive' 
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ 
        error: 'Forbidden - Admin access required' 
      });
    }

    // Add user info to request object for use in routes
    req.user = {
      firebaseUid,
      role: user.role,
      isActive: user.is_active
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = adminAuthMiddleware;