const express = require('express');
const Product = require('../models/Product');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/products', authenticate, authorize('customer'), async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' })
      .populate('vendor', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get product details
router.get('/products/:id', authenticate, authorize('customer'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'firstName lastName');
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;