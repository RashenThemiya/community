const express = require('express');
const router = express.Router();
const Price = require('../models/Price');
const Product = require('../models/Product');
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// 1. Add or update daily price for a product
// Bulk add/update daily prices
router.post('/update-multiple', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const entries = req.body;

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ message: 'Request body must be a non-empty array.' });
  }

  const results = [];
  const errors = [];

  for (const entry of entries) {
    const { product_id, price, date } = entry;

    if (!product_id || !price || !date) {
      errors.push({ entry, message: 'Missing required fields' });
      continue;
    }

    try {
      const [priceRecord, created] = await Price.findOrCreate({
        where: { product_id, date },
        defaults: { price }
      });

      if (!created) {
        priceRecord.price = price;
        await priceRecord.save();
      }

      results.push({
        product_id,
        date,
        status: created ? 'added' : 'updated',
        price: priceRecord.price,
      });
    } catch (err) {
      errors.push({ entry, message: err.message });
    }
  }

  res.status(200).json({
    message: `Processed ${results.length} entries.`,
    results,
    errors,
  });
});

router.post('/update', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { product_id, price, date } = req.body;

  if (!product_id || !price || !date) {
    return res.status(400).json({ message: 'product_id, price, and date are required.' });
  }

  try {
    const [priceRecord, created] = await Price.findOrCreate({
      where: { product_id, date },
      defaults: { price }
    });

    if (!created) {
      priceRecord.price = price;
      await priceRecord.save();
    }

    res.status(200).json({
      message: created ? 'Price added successfully' : 'Price updated successfully',
      data: priceRecord
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating price', error: err.message });
  }
});

// 2. Get price chart for a specific product (all price history)
router.get('/product/:productId/chart', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { productId } = req.params;

  try {
    const prices = await Price.findAll({
      where: { product_id: productId },
      order: [['date', 'ASC']],
    });

    res.status(200).json(prices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching price chart', error: err.message });
  }
});

// 3. Get all product prices on a specific day
router.get('/by-date/:date', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { date } = req.params;

  try {
    const prices = await Price.findAll({
      where: { date },
      include: [{ model: Product, attributes: ['id', 'name', 'type'] }],
    });

    const formatted = prices.map(p => ({
      id: p.id,
      date: p.date,
      amount: p.price,
      product: {
        id: p.Product.id,
        name: p.Product.name,
        type: p.Product.type,
      }
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching prices for date', error: err.message });
  }
});

// 4. Get price of a specific product on a specific day
router.get('/product/:productId/date/:date', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { productId, date } = req.params;

  try {
    const price = await Price.findOne({
      where: {
        product_id: productId,
        date
      }
    });

    if (!price) {
      return res.status(404).json({ message: 'Price not found for given product and date' });
    }

    res.status(200).json(price);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching price', error: err.message });
  }
});
router.put('/product/:productId/date/:date', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { productId, date } = req.params;
  const { price } = req.body;

  if (!price) {
    return res.status(400).json({ message: 'Price is required.' });
  }

  try {
    const priceRecord = await Price.findOne({
      where: {
        product_id: productId,
        date
      }
    });

    if (!priceRecord) {
      return res.status(404).json({ message: 'Price record not found.' });
    }

    priceRecord.price = price;
    await priceRecord.save();

    res.status(200).json({
      message: 'Price updated successfully',
      data: priceRecord
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating price', error: err.message });
  }
});


module.exports = router;
