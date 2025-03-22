const { Sequelize } = require('sequelize');
const Fine = require('../models/Fine');
const Invoice = require('../models/Invoice');
const Rent = require('../models/Rent');
const AuditTrail = require('../models/AuditTrail');
const sequelize = require('../config/database');

/**
 * Apply a fine to an invoice (30% of unpaid rent amount).
 * @param {number} invoiceId - The ID of the invoice.
 * @returns {object} - Success or failure response.
 */
async function applyFine(invoiceId) {
    const t = await sequelize.transaction();
    try {
        // Fetch invoice details
        const invoice = await Invoice.findByPk(invoiceId, { transaction: t });
        if (!invoice) {
            throw new Error("Invoice not found.");
        }

        // Extract shop_id from the invoice
        const shopId = invoice.shop_id;

        // Check if a fine already exists for this invoice
        const existingFine = await Fine.findOne({
            where: { invoice_id: invoiceId },
            transaction: t
        });

        if (existingFine) {
            return { success: false, message: "Fine already exists for this invoice." };
        }

        // Fetch Rent records for the invoice
        const rents = await Rent.findAll({
            where: { invoice_id: invoiceId },
            transaction: t
        });

        if (rents.length === 0) {
            return { success: false, message: "No rent records found for this invoice." };
        }

        let totalFineAmount = 0;

        for (const rent of rents) {
            const outstandingRent = parseFloat(rent.rent_amount) - parseFloat(rent.paid_amount);
            if (outstandingRent > 0) {
                const fineAmount = outstandingRent * 0.30; // 30% of the remaining rent
                totalFineAmount += fineAmount;
            }
        }

        if (totalFineAmount === 0) {
            return { success: false, message: "No outstanding rent to apply a fine." };
        }

        // Create Fine Record with shop_id
        await Fine.create({
            invoice_id: invoiceId,
            shop_id: shopId, // Added shop_id
            fine_amount: totalFineAmount.toFixed(2),
            status: 'Unpaid'
        }, { transaction: t });

        // Update invoice fine & total arrears
        invoice.total_arrears += totalFineAmount;
        await invoice.save({ transaction: t });

        // Log in Audit Trail
        await AuditTrail.create({
            shop_id: shopId, // Log event with shop_id
            event_type: 'Fine Applied',
            event_description: `A fine of ${totalFineAmount.toFixed(2)} was applied to Invoice ID ${invoiceId}.`,
            user_actioned: 'System'
        }, { transaction: t });

        await t.commit();
        return { success: true, message: `Fine of ${totalFineAmount.toFixed(2)} applied successfully.` };
    } catch (error) {
        await t.rollback();
        console.error("❌ Fine Application Error:", error);
        return { success: false, message: error.message };
    }
}

module.exports = { applyFine };
