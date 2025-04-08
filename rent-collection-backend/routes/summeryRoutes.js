const express = require('express');
const { Sequelize } = require('sequelize');
const Invoice = require('../models/Invoice');
const Fine = require('../models/Fine');
const Rent = require('../models/Rent');
const Vat = require('../models/VAT');
const Shop = require('../models/Shop');
const ShopBalance = require('../models/ShopBalance');
const Tenant = require('../models/Tenant'); // Import Tenant model
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get counts and sums
router.get('/summary', authenticateUser, authorizeRole(['admin', 'superadmin']), async (req, res) => {
    try {
        const invoiceCounts = await Invoice.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('invoice_id')), 'total_invoices'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'Paid' THEN 1 ELSE 0 END")), 'paid_count'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'Unpaid' THEN 1 ELSE 0 END")), 'unpaid_count'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'Arrest' THEN 1 ELSE 0 END")), 'arrest_count'],
                [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN status = 'Partially Paid' THEN 1 ELSE 0 END")), 'partial_count']
            ]
        });

        const rentSums = await Rent.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('rent_amount')), 'total_rent_amount'],
                [Sequelize.fn('SUM', Sequelize.col('paid_amount')), 'total_rent_paid']
            ]
        });

        const vatSums = await Vat.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('vat_amount')), 'total_vat_amount'],
                [Sequelize.fn('SUM', Sequelize.col('paid_amount')), 'total_vat_paid']
            ]
        });

        const fineSums = await Fine.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('fine_amount')), 'total_fine_amount'],
                [Sequelize.fn('SUM', Sequelize.col('paid_amount')), 'total_fine_paid']
            ]
        });

        const shopBalanceSum = await ShopBalance.findAll({
            attributes: [[Sequelize.fn('SUM', Sequelize.col('balance_amount')), 'total_shop_balance']]
        });

        const shopCount = await Shop.count();
        const tenantCount = await Tenant.count(); // Fetch total number of tenants

        res.json({
            invoiceCounts: invoiceCounts[0],
            rentSums: rentSums[0],
            vatSums: vatSums[0],
            fineSums: fineSums[0],
            shopBalanceSum: shopBalanceSum[0],
            shopCount: shopCount,
            tenantCount: tenantCount  // Include tenant count in response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
