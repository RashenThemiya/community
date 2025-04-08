const express = require('express');
const { Op } = require('sequelize');
const Shop = require('../models/Shop');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Fine = require('../models/Fine');
const OperationFee = require('../models/OperationFee');
const Rent = require('../models/Rent');
const Vat = require('../models/VAT');
const AuditTrail = require('../models/AuditTrail');
const shopBalance = require('../models/ShopBalance');
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware"); // ✅ Import middleware once

const router = express.Router();

router.put('/update-vat-rate', authenticateUser, authorizeRole(["admin", "superadmin"]), async (req, res) => {
  const { newVatRate } = req.body;

  if (!newVatRate) {
    return res.status(400).json({ message: 'New VAT rate is required.' });
  }

  try {
    const [updatedRows] = await Shop.update(
      { vat_rate: newVatRate },
      { where: {} }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'No shops found to update.' });
    }

    return res.status(200).json({ message: `VAT rate updated for ${updatedRows} shops successfully.` });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating VAT rate for all shops', error: err.message });
  }
});


module.exports = router; // Make sure to export the router
