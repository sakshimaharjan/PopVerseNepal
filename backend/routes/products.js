const express = require('express');
const Product = require('../models/Product'); // Ensure you have this model
const router = express.Router();
const multer = require('multer');

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});
const upload = multer({ storage });

// Create a product
router.post('/', upload.single('image'), async (req, res) => {
  const { name, price, category, description, isExclusive } = req.body;
  const image = req.file ? `/uploads/images/${req.file.filename}` : null;

  const newProduct = new Product({
    name,
    price,
    category,
    description,
    isExclusive,
    image
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

module.exports = router;