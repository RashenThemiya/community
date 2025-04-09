const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Price = require('../models/Price');

// 🆕 Add or Update Price for a Product
router.post('/add', async (req, res) => {
    try {
        const { product_id, price, date } = req.body;

        if (!product_id || !price || !date) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const [updatedOrCreated, created] = await Price.upsert({ product_id, price, date });

        const savedPrice = await Price.findOne({
            where: { product_id, date }
        });

        res.json({
            message: created ? 'Price added successfully' : 'Price updated successfully',
            data: savedPrice
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Daily Food Prices (for a specific date)
router.get('/daily', async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: "Missing 'date' query parameter" });
        }

        const prices = await Price.findAll({
            where: { date },
            include: {
                model: Product,
                attributes: ['id', 'name', 'type']
            },
            order: [[Product, 'name', 'ASC']]
        });

        const formatted = prices.map(entry => ({
            product_id: entry.product_id,
            food_name: entry.Product.name,
            price: entry.price,
            date: entry.date
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Price History for One Food Item
router.get('/history/:product_id', async (req, res) => {
    try {
        const { product_id } = req.params;

        const history = await Price.findAll({
            where: { product_id },
            order: [['date', 'DESC']]
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get All Price History (grouped by product)
router.get('/history-all', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: {
                model: Price,
                attributes: ['price', 'date'],
                order: [['date', 'ASC']]
            },
            order: [['name', 'ASC']]
        });

        const result = products.map(product => ({
            food_name: product.name,
            product_id: product.id,
            history: product.Prices.map(p => ({
                price: p.price,
                price_date: p.date
            }))
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching price history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
