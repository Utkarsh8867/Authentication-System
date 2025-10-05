const express = require('express');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Admin routes working' });
});

// Get all users (Admin only)
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    console.log('Admin users request from user:', req.user);
    const users = await User.find({}).select('-password -refreshTokens').sort({ createdAt: -1 });
    console.log('Found users:', users.length);
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;