const express = require('express');
const Invoice = require('../models/Invoice');
const Shop = require('../models/Shop');
const Tenant = require('../models/Tenant');
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all invoices with shop details and tenant (owner) information

// Get all invoices with shop details and tenant information
router.get('/', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            include: [
                {
                    model: Shop,
                    attributes: ['shop_name','location'],
                    include: [
                        {
                            model: Tenant,
                            attributes: ['name', 'contact'] // Fetch tenant details via Shop
                        }
                    ]
                }
            ]
        });

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
