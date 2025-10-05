const express = require('express');
const Product = require('../models/Product');
const { authenticate, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Get vendor's products
router.get('/products', authenticate, authorize('vendor'), async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new product
router.post('/products', authenticate, authorize('vendor'), [
  body('name').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('category').trim().isLength({ min: 1 }),
  body('stock').isNumeric().isInt({ min: 0 })
], async (req, res) => {
  try {
    console.log('Product creation request:', req.body);
    console.log('User:', req.user);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const product = new Product({
      ...req.body,
      vendor: req.user._id
    });

    await product.save();
    console.log('Product saved:', product);
    res.status(201).json({ success: true, message: 'Product added successfully', data: product });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update product
router.put('/products/:id', authenticate, authorize('vendor'), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.user._id },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product
router.delete('/products/:id', authenticate, authorize('vendor'), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user._id });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;