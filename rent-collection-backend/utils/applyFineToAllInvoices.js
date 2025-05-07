const { Sequelize } = require('sequelize');
const Invoice = require('../models/Invoice');
const Fine = require('../models/Fine');
const AuditTrail = require('../models/AuditTrail');
const { applyFine } = require('../utils/applyFine');
const sequelize = require('../database'); // Required for transaction fallback
const dayjs = require('dayjs');

/**
 * Apply fines to all eligible invoices that are older than 17 days and do NOT already have a fine.
 * @param {Transaction} [externalTransaction] - Optional Sequelize transaction.
 * @returns {object} - Success or failure response.
 */
async function applyFineToAllInvoices(externalTransaction = null) {
  const transaction = externalTransaction || await sequelize.transaction();
  let committedInternally = false;

  try {
    const fineThresholdDate = dayjs().subtract(15, 'days').toDate(); // Corrected threshold

    const invoices = await Invoice.findAll({
      where: {
        status: { [Sequelize.Op.in]: ['Unpaid', 'Partially Paid', 'Arrest'] },
        createdAt: { [Sequelize.Op.lte]: fineThresholdDate }
      },
      transaction
    });

    if (invoices.length === 0) {
      if (!externalTransaction) await transaction.rollback();
      return { success: false, message: "No eligible invoices found for fine application." };
    }

    const invoiceIds = invoices.map(inv => inv.invoice_id);
    const finedInvoices = await Fine.findAll({
      attributes: ['invoice_id'],
      where: { invoice_id: { [Sequelize.Op.in]: invoiceIds } },
      raw: true,
      transaction
    });

    const finedInvoiceIds = new Set(finedInvoices.map(f => f.invoice_id));
    const invoicesToFine = invoices.filter(inv => !finedInvoiceIds.has(inv.invoice_id));

    if (invoicesToFine.length === 0) {
      if (!externalTransaction) await transaction.rollback();
      return { success: false, message: "All eligible invoices already have fines." };
    }

    let totalFinedInvoices = 0;

    // You can use batching for better control (limit concurrency)
    for (const invoice of invoicesToFine) {
      const result = await applyFine(invoice.invoice_id, transaction); // <-- modify applyFine to accept `transaction`
      if (result.success) {
        totalFinedInvoices++;

        await AuditTrail.create({
          shop_id: invoice.shop_id,
          invoice_id: invoice.invoice_id,
          event_type: 'Fine Applied',
          event_description: `Fine applied to invoice #${invoice.invoice_id} due to overdue payment.`,
          old_value: null,
          new_value: result.fineAmount,
          user_actioned: 'System'
        }, { transaction });
      }
    }

    if (!externalTransaction) {
      await transaction.commit();
      committedInternally = true;
    }

    return { success: true, message: `${totalFinedInvoices} invoices fined successfully.` };

  } catch (error) {
    if (!externalTransaction && !committedInternally) {
      await transaction.rollback();
    }
    console.error("❌ Fine Application Error:", error);
    return { success: false, message: error.message };
  }
}

module.exports = { applyFineToAllInvoices };
