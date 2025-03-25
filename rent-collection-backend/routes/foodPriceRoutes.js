const express = require('express');
const router = express.Router();
const FoodPrice = require('../models/FoodPrice');

// Add or Update Food Price
router.post('/add', async (req, res) => {
    try {
        const { food_id, food_name, price_date, price } = req.body;

        const [foodPrice, created] = await FoodPrice.upsert({
            food_id,
            food_name,
            price_date,
            price
        });

        res.json({
            message: created ? 'Price added successfully' : 'Price updated successfully',
            data: foodPrice
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Daily Food Prices
router.get('/daily', async (req, res) => {
    try {
        const { price_date } = req.query;
        const prices = await FoodPrice.findAll({ where: { price_date } });
        res.json(prices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Price History for a Food Item
router.get('/history/:food_id', async (req, res) => {
    try {
        const { food_id } = req.params;
        const history = await FoodPrice.findAll({ 
            where: { food_id },
            order: [['price_date', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
