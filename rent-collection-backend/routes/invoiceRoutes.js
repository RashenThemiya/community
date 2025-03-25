const express = require('express');
const Invoice = require('../models/Invoice');
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all invoices (Admin & Superadmin)
router.get('/', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
    try {
        const invoices = await Invoice.findAll();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error: error.message });
    }
});

// Get invoice by ID (Admin & Superadmin)
router.get('/:invoiceId', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
    const { invoiceId } = req.params;
    try {
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoice', error: error.message });
    }
});

router.patch('/:invoiceId/print', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
  const { invoiceId } = req.params;

  try {
      const invoice = await Invoice.findByPk(invoiceId);
      if (!invoice) {
          return res.status(404).json({ message: "Invoice not found" });
      }

      // Increment printedtime
      invoice.printedtime += 1;
      await invoice.save();

      res.status(200).json({ message: "Invoice printed successfully", printedtime: invoice.printedtime });
  } catch (error) {
      res.status(500).json({ message: "Error updating printed count", error: error.message });
  }
});

module.exports = router;
