const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice'); // Assuming you have this model
const Payment = require('../models/Payment'); // Assuming you have this model
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// Set up multer storage to handle file uploads
const storage = multer.memoryStorage(); // Store files in memory (can be changed to diskStorage if needed)
const upload = multer({ storage: storage });

const router = express.Router();

// Get all products (accessible by Admin and Super Admin)
// In your product route
router.get('/', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const products = await Product.findAll();

    // Convert image data to base64 if it exists
    const formattedProducts = products.map(product => ({
      ...product.toJSON(),
      image: product.image ? `data:image/jpeg;base64,${product.image.toString('base64')}` : null
    }));

    res.status(200).json(formattedProducts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// Get product by ID (accessible by Admin and Super Admin)
router.get('/:productId', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});

// Add new product (only accessible by Super Admin)
router.post('/', authenticateUser, authorizeRole(['admin','superadmin']), upload.single('image'), async (req, res) => {
  const { name, type } = req.body;
  const image = req.file ? req.file.buffer : null; // Store image as binary data if file is uploaded

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required.' });
  }

  try {
    const newProduct = await Product.create({ name, type, image });
    res.status(201).json({ message: 'Product added successfully', productId: newProduct.id });
  } catch (err) {
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

// Update product (only accessible by Super Admin)
router.put('/:productId', authenticateUser, authorizeRole(["superadmin"]), upload.single('image'), async (req, res) => {
  const { productId } = req.params;
  const { name, type } = req.body;
  const image = req.file ? req.file.buffer : null; // Update image if uploaded

  if (!name || !type) {
    return res.status(400).json({ message: 'Name and type are required.' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.update({ name, type, image });
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// Delete product (only accessible by Super Admin)
router.delete('/:productId', authenticateUser, authorizeRole(["superadmin"]), async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

// GET product summary (including related data like invoices and payments)
router.get('/product-summary/:productId', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch product details along with related records (for example: invoices, payments)
    const product = await Product.findOne({
      where: { id: productId },
      include: [
        { 
          model: Invoice, 
          separate: true, 
          include: [{ model: Payment }] // Assuming you have models for invoice and payment
        },
        // You can add more related models here
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error('Error fetching product summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
