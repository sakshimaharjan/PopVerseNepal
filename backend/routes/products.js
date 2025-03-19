const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products', // Cloudinary folder where images will be stored
    format: async (req, file) => 'png', // File format (can be jpg, png, etc.)
    public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique filename
  },
});

const upload = multer({ storage });

// Create a product with Cloudinary image upload
router.post('/', upload.single('image'), async (req, res, next) => {
  const { name, price, category, description, isExclusive } = req.body;
  const image = req.file ? req.file.path : null; // Cloudinary URL

  const newProduct = new Product({
    name,
    price,
    category,
    description,
    isExclusive,
    image,
  });

  try {
    const savedProduct = await newProduct.save();
    console.log('Product added successfully:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);  // Pass error to the next middleware (error handler)
  }
});

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find();
    console.log('Fetched products:', products.length, 'products found.');
    res.status(200).json(products);
  } catch (error) {
    next(error);  // Pass error to the next middleware (error handler)
  }
});

// Get a single product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log(`Product with ID ${req.params.id} not found.`);
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log('Fetched product:', product);
    res.status(200).json(product);
  } catch (error) {
    next(error);  // Pass error to the next middleware (error handler)
  }
});

module.exports = router;