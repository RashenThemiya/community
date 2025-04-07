const express = require('express');
const router = express.Router();
const FoodPrice = require('../models/FoodPrice');

// ✅ Add or Update Food Price
router.post('/add', async (req, res) => {
    try {
        const { food_id, food_name, price_date, price } = req.body;

        // Upsert the record using composite key
        const [_, created] = await FoodPrice.upsert({
            food_id,
            food_name,
            price_date,
            price
        });

        // Refetch the saved record to return it
        const foodPrice = await FoodPrice.findOne({ where: { food_id, price_date } });

        res.json({
            message: created ? 'Price added successfully' : 'Price updated successfully',
            data: foodPrice
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Daily Food Prices
router.get('/daily', async (req, res) => {
    try {
        const { price_date } = req.query;

        if (!price_date) {
            return res.status(400).json({ error: "Missing 'price_date' query parameter" });
        }

        const prices = await FoodPrice.findAll({
            where: { price_date },
            order: [['food_name', 'ASC']]
        });

        res.json(prices);   //It returns the result as a JSON array of food prices.
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Price History for a Food Item
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


// ✅ Get All Price History
// It returns an array of objects, each containing food_id, food_name, and an array of price history.
router.get('/history-all', async (req, res) => {
    try {
      const allPrices = await FoodPrice.findAll({
        order: [['food_id', 'ASC'], ['price_date', 'ASC']]
      });
  
      const grouped = {};
  
      allPrices.forEach(entry => {
        const { food_id, food_name, price_date, price } = entry;
  
        if (!grouped[food_id]) {
          grouped[food_id] = {
            food_id,
            food_name,
            history: []
          };
        }
  
        grouped[food_id].history.push({ price_date, price });
      });
  
      res.json(Object.values(grouped));
    } catch (error) {
      console.error('Error fetching price history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
