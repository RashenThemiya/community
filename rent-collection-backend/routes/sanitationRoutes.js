const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const Sanitation = require('../models/Sanitation');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Issue a new sanitation ticket
router.post('/', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { price } = req.body;

  if (!price) {
    return res.status(400).json({ message: 'Price is required.' });
  }

  try {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Assuming the logged-in user's info is available via req.user (e.g., from JWT token)
    const byWhom = req.user.email; // You can also use req.user.name or req.user.username depending on the JWT token content

    const ticket = await Sanitation.create({
      price,
      date,
      byWhom // Add the 'byWhom' field here
    });

    res.status(201).json({
      message: 'Sanitation ticket issued successfully',
      ticketId: ticket.id, // ✅ For frontend printing
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Error issuing sanitation ticket', error: error.message });
  }
});

// 📅 Get sanitation tickets by date (pass ?date=YYYY-MM-DD)
router.get('/by-date', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { date } = req.query;

  try {
    const whereClause = date ? { date } : {};
    const tickets = await Sanitation.findAll({
      where: whereClause,
      attributes: ['id', 'price', 'date', 'byWhom'] // Include 'byWhom' field
    });

    res.status(200).json({ count: tickets.length, tickets });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sanitation tickets', error: error.message });
  }
});

// 💰 Daily income summary for sanitation
// 💰 Daily income summary for sanitation (optionally accepts ?date=YYYY-MM-DD)
router.get('/daily-income', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { date } = req.query;

  try {
    const whereClause = date ? { date } : {};

    const dailyIncome = await Sanitation.findAll({
      attributes: [
        [fn('DATE', col('date')), 'date'],
        [fn('SUM', col('price')), 'totalIncome'],
        [fn('COUNT', col('id')), 'ticketCount']
      ],
      where: whereClause,
      group: [literal('DATE(date)')],
      order: [[literal('DATE(date)'), 'DESC']]
    });

    res.status(200).json(dailyIncome);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily income', error: error.message });
  }
});

// 📆 Monthly income summary for sanitation
router.get('/monthly-income', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const monthlyIncome = await Sanitation.findAll({
      attributes: [
        [fn('YEAR', col('date')), 'year'],
        [fn('MONTH', col('date')), 'month'],
        [fn('SUM', col('price')), 'totalIncome'],
        [fn('COUNT', col('id')), 'ticketCount']
      ],
      group: [fn('YEAR', col('date')), fn('MONTH', col('date'))],
      order: [
        [fn('YEAR', col('date')), 'DESC'],
        [fn('MONTH', col('date')), 'DESC']
      ]
    });

    res.status(200).json(monthlyIncome);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching monthly income', error: error.message });
  }
});

module.exports = router;
