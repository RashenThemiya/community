const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Invoice = require('../models/Invoice');
const Rent = require('../models/Rent');
const Fine = require('../models/Fine');
const ShopBalance = require('../models/ShopBalance');
const AuditTrail = require('../models/AuditTrail');
const dayjs = require('dayjs');
const { 
    runInvoicePaymentProcessWithoutAddingToShopBalance
  } = require('../utils/processPayment');
async function handlePaymentCorrection({ invoice_id = null, shop_id, actual_amount, admin_put_amount, edit_reason = null }) {
    const t = await sequelize.transaction();
    try {
        // Ensure amounts are properly parsed
        const actualAmount = parseFloat(actual_amount) || 0;
        const adminPutAmount = parseFloat(admin_put_amount) || 0;
        const missed_amount = actualAmount - adminPutAmount;

        // Fetch Shop Balance
        let shopBalance = await ShopBalance.findOne({ where: { shop_id }, transaction: t });

        if (!shopBalance) {
            shopBalance = await ShopBalance.create(
                { shop_id, balance_amount: 0, last_updated: new Date() },
                { transaction: t }
            );
        }

        // Convert balance_amount to a proper number before any operations
        shopBalance.balance_amount = parseFloat(shopBalance.balance_amount) || 0;

        // Store old balance for logging
        const oldBalance = shopBalance.balance_amount;

        if (invoice_id) {
            // Case 1: Correction with invoice_id
            const invoice = await Invoice.findOne({ where: { invoice_id }, transaction: t });
            if (!invoice) throw new Error('Invoice not found');

            const rent = await Rent.findOne({ where: { invoice_id }, transaction: t });
            if (!rent) throw new Error('Associated Rent not found');

            if (missed_amount > 0) {
                // Refund any paid fine before deleting the fine
                const fine = await Fine.findOne({ where: { invoice_id }, transaction: t });
                if (fine) {
                    if (fine.status === 'Paid') {
                        shopBalance.balance_amount += parseFloat(fine.amount) || 0;
                    }
                    await Fine.destroy({ where: { invoice_id }, transaction: t });
                }

                shopBalance.balance_amount += missed_amount;
            } else if (missed_amount < 0) {
                // If invoice is unpaid and older than 17 days, apply fine
                const invoiceAge = dayjs().diff(dayjs(invoice.createdAt), 'day');
                if (invoice.status !== 'Paid' && invoiceAge > 17) {
                    const unpaidAmount = parseFloat(rent.amount) - parseFloat(rent.paid_amount);
                    const fineAmount = unpaidAmount * 0.30;
                    await Fine.create({ invoice_id, shop_id, amount: fineAmount, status: 'Unpaid' }, { transaction: t });
                }
                shopBalance.balance_amount += missed_amount;
            }
        } else {
            // Case 2: Correction without invoice_id (directly on shop balance)
            shopBalance.balance_amount += missed_amount;
        }

        // Ensure balance remains a proper number before formatting
        shopBalance.balance_amount = parseFloat(shopBalance.balance_amount.toFixed(2));

        shopBalance.last_updated = new Date();
        await shopBalance.save({ transaction: t });

        // If shop balance is greater than 0, run the invoice payment process
        if (shopBalance.balance_amount > 0) {
            await runInvoicePaymentProcessWithoutAddingToShopBalance(shop_id);
        }

        // Log Audit Trail
        await AuditTrail.create(
            {
                shop_id,
                invoice_id, // Store even if it's NULL
                event_type: 'Correction',
                event_description: `Corrected payment: actual=${actualAmount}, admin_put=${adminPutAmount}, difference=${missed_amount}`,
                old_value: oldBalance,
                new_value: shopBalance.balance_amount,
                edit_reason, // Store edit reason if provided
                user_actioned: 'Admin'
            },
            { transaction: t }
        );

        await t.commit();
        return { success: true, message: 'Payment correction applied successfully' };
    } catch (error) {
        await t.rollback();
        console.error('❌ Payment Correction Error:', error);
        return { success: false, message: error.message };
    }
}

module.exports = { handlePaymentCorrection };
