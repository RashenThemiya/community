const { Sequelize } = require('sequelize');
const Invoice = require('../models/Invoice');
const Fine = require('../models/Fine'); // Import Fine model
const AuditTrail = require('../models/AuditTrail'); // Import AuditTrail model
const { applyFine } = require('../utils/applyFine'); // Import applyFine function
const dayjs = require('dayjs');

/**
 * Apply fines to all eligible invoices that are older than 17 days and do NOT already have a fine.
 * @returns {object} - Success or failure response.
 */
async function applyFineToAllInvoices() {
    try {
        // Get the threshold date (17 days ago)
        const fineThresholdDate = dayjs().subtract(15, 'days').toDate();

        // Fetch all invoices that are "Unpaid", "Partially Paid", or "Arrest" and older than 17 days
        const invoices = await Invoice.findAll({
            where: {
                status: { [Sequelize.Op.in]: ['Unpaid', 'Partially Paid', 'Arrest'] },
                createdAt: { [Sequelize.Op.lte]: fineThresholdDate } // Corrected field name
            }
        });

        if (invoices.length === 0) {
            return { success: false, message: "No eligible invoices found for fine application." };
        }

        // Fetch invoices that already have a fine
        const invoiceIds = invoices.map(inv => inv.invoice_id);
        const finedInvoices = await Fine.findAll({
            attributes: ['invoice_id'],
            where: { invoice_id: { [Sequelize.Op.in]: invoiceIds } },
            raw: true
        });

        const finedInvoiceIds = new Set(finedInvoices.map(fine => fine.invoice_id));

        // Select only invoices that do NOT already have a fine
        const invoicesToFine = invoices.filter(inv => !finedInvoiceIds.has(inv.invoice_id));

        if (invoicesToFine.length === 0) {
            return { success: false, message: "All eligible invoices already have fines." };
        }

        let totalFinedInvoices = 0;
        for (const invoice of invoicesToFine) {
            const result = await applyFine(invoice.invoice_id);
            if (result.success) {
                totalFinedInvoices++;

                // Log Audit Trail for fine application
                await AuditTrail.create({
                    shop_id: invoice.shop_id,
                    invoice_id: invoice.invoice_id,
                    event_type: 'Fine Applied',
                    event_description: `Fine applied to invoice #${invoice.invoice_id} due to overdue payment.`,
                    old_value: null, // No previous fine value
                    new_value: result.fineAmount, // Fine amount applied
                    user_actioned: 'System' // Since this is an automated process
                });
            }
        }

        return { success: true, message: `${totalFinedInvoices} invoices fined successfully.` };
    } catch (error) {
        console.error("❌ Fine Application Error:", error);
        return { success: false, message: error.message };
    }
}

module.exports = { applyFineToAllInvoices };
