const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const VehicleTicket = require('../models/VehicleTicket');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Issue a new vehicle ticket
router.post('/', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { vehicleNumber, vehicleType, ticketPrice } = req.body;

  if (!vehicleNumber || !vehicleType || !ticketPrice) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const ticket = await VehicleTicket.create({
      vehicleNumber,
      vehicleType,
      ticketPrice
    });

    res.status(201).json({ message: 'Ticket issued successfully', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error issuing ticket', error: error.message });
  }
});

// 📅 Get tickets by specific date (optional: pass ?date=YYYY-MM-DD)
router.get('/by-date', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { date } = req.query;

  try {
    const whereClause = date ? { date } : {};
    const tickets = await VehicleTicket.findAll({ where: whereClause });

    res.status(200).json({ count: tickets.length, tickets });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
});

// 💰 Get total income grouped by day
router.get('/daily-income', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const dailyIncome = await VehicleTicket.findAll({
      attributes: [
        [fn('DATE', col('date')), 'date'],
        [fn('SUM', col('ticketPrice')), 'totalIncome'],
        [fn('COUNT', col('id')), 'ticketCount']
      ],
      group: [literal('DATE(date)')],
      order: [[literal('DATE(date)'), 'DESC']]
    });

    res.status(200).json(dailyIncome);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily income data', error: error.message });
  }
});

// 📆 Get total income grouped by month and year
router.get('/monthly-income', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  try {
    const monthlyIncome = await VehicleTicket.findAll({
      attributes: [
        [fn('YEAR', col('date')), 'year'],
        [fn('MONTH', col('date')), 'month'],
        [fn('SUM', col('ticketPrice')), 'totalIncome'],
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
    res.status(500).json({ message: 'Error fetching monthly income data', error: error.message });
  }
});

module.exports = router;
