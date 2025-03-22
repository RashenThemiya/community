const express = require('express');
const Shop = require('../models/Shop');
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all shops (accessible by Admin and Super Admin)
router.get('/', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const shops = await Shop.findAll();
    res.status(200).json(shops);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shops', error: err.message });
  }
});

// Get shop by ID (accessible by Admin and Super Admin)
router.get('/:shopId', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { shopId } = req.params;
  try {
    const shop = await Shop.findByPk(shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.status(200).json(shop);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shop', error: err.message });
  }
});

// Add new shop (only accessible by Super Admin)
router.post('/', authenticateUser, authorizeRole(["admin", "superadmin"]), async (req, res) => {
  const { shop_id, shop_name, location, rent_amount, vat_rate, operation_fee } = req.body;

  if (!shop_id || !shop_name || !location || !rent_amount || !vat_rate || !operation_fee) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newShop = await Shop.create({
      shop_id,
      shop_name,
      location,
      rent_amount,
      vat_rate,
      operation_fee
    });
    res.status(201).json({ message: 'Shop added successfully', shopId: newShop.shop_id });
  } catch (err) {
    res.status(500).json({ message: 'Error adding shop', error: err.message });
  }
});

// Update shop (only accessible by Super Admin)
router.put('/:shopId', authenticateUser, authorizeRole(["admin", "superadmin"]), async (req, res) => {
  const { shopId } = req.params;
  const { shop_name, location, rent_amount, vat_rate, operation_fee } = req.body;

  if (!shop_name || !location || !rent_amount || !vat_rate || !operation_fee) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const shop = await Shop.findByPk(shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    await shop.update({ shop_name, location, rent_amount, vat_rate, operation_fee });
    res.status(200).json({ message: 'Shop updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating shop', error: err.message });
  }
});

// Delete shop (only accessible by Super Admin)
router.delete('/:shopId', authenticateUser, authorizeRole(['superadmin']), async (req, res) => {
  const { shopId } = req.params;

  try {
    const shop = await Shop.findByPk(shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    await shop.destroy();
    res.status(200).json({ message: 'Shop deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting shop', error: err.message });
  }
});

module.exports = router;
