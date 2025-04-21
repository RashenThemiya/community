const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Invoice = require('../models/Invoice');
const Rent = require('../models/Rent');
const Fine = require('../models/Fine');
const ShopBalance = require('../models/ShopBalance');
const AuditTrail = require('../models/AuditTrail');
const Payment = require('../models/Payment'); // Import Payment model
const dayjs = require('dayjs');
const { runInvoicePaymentProcessWithoutAddingToShopBalance } = require('../utils/processPayment');

async function handlePaymentCorrection({ invoice_id = null, shop_id, actual_amount, admin_put_amount, edit_reason = null }) {
    const t = await sequelize.transaction();
    try {
        // Ensure amounts are properly parsed
        const actualAmount = isNaN(parseFloat(actual_amount)) ? 0 : parseFloat(actual_amount);
        const adminPutAmount = isNaN(parseFloat(admin_put_amount)) ? 0 : parseFloat(admin_put_amount);
        const missed_amount = actualAmount - adminPutAmount;

        // Fetch or create Shop Balance
        let shopBalance = await ShopBalance.findOne({ where: { shop_id }, transaction: t });
        if (!shopBalance) {
            shopBalance = await ShopBalance.create(
                { shop_id, balance_amount: 0, last_updated: new Date() },
                { transaction: t }
            );
        }

        shopBalance.balance_amount = parseFloat(shopBalance.balance_amount) || 0;
        const oldBalance = shopBalance.balance_amount;

        if (invoice_id) {
            const invoice = await Invoice.findOne({ where: { invoice_id }, transaction: t });
            if (!invoice) throw new Error('Invoice not found');

            const rent = await Rent.findOne({ where: { invoice_id }, transaction: t });
            if (!rent) throw new Error('Associated Rent not found');

            if (missed_amount > 0) {
                // Refund any paid fine before deleting it
                const fine = await Fine.findOne({ where: { invoice_id }, transaction: t });
                if (fine && fine.status === 'Paid') {
                    shopBalance.balance_amount += parseFloat(fine.amount) || 0;
                }
                await Fine.destroy({ where: { invoice_id }, transaction: t });

                // Add missed amount to shop balance
                shopBalance.balance_amount += missed_amount;

                // ✅ Add entry to Payment table for missed amount correction
                await Payment.create(
                    {
                        shop_id,
                        invoice_id,
                        amount_paid: missed_amount,  // Ensure this is always a valid number
                        payment_date: new Date(),
                        payment_method: 'Correction Made',  // This is required to avoid the validation error
                    },
                    { transaction: t }
                );
            } else if (missed_amount < 0) {
                // Apply fine if invoice is older than 17 days and unpaid
                const invoiceAge = dayjs().diff(dayjs(invoice.createdAt), 'day');
                if (invoice.status !== 'Paid' && invoiceAge > 17) {
                    const unpaidAmount = parseFloat(rent.amount) - parseFloat(rent.paid_amount);
                    const fineAmount = unpaidAmount * 0.30;
                    await Fine.create({ invoice_id, shop_id, amount: fineAmount, status: 'Unpaid' }, { transaction: t });
                }
                shopBalance.balance_amount += missed_amount;
            }
        } else {
            shopBalance.balance_amount += missed_amount;

            // ✅ Add to Payment table if missed_amount > 0 and no invoice ID
            if (missed_amount > 0) {
                await Payment.create(
                    {
                        shop_id,
                        amount_paid: missed_amount,  // Fixed the amount field name and provided the correct value
                        payment_date: new Date(),
                        payment_method: 'Correction Made',  // Correct payment method value
                    },
                    { transaction: t }
                );
            }
        }

        shopBalance.balance_amount = parseFloat(shopBalance.balance_amount.toFixed(2));
        shopBalance.last_updated = new Date();
        await shopBalance.save({ transaction: t });

        // Run invoice payment process if shop balance is positive
        if (shopBalance.balance_amount > 0) {
            await runInvoicePaymentProcessWithoutAddingToShopBalance(shop_id);
        }

        let newShopBalance = await ShopBalance.findOne({ where: { shop_id }, transaction: t });

        // Log Audit Trail
        await AuditTrail.create(
            {
                shop_id,
                invoice_id, 
                event_type: 'Correction',
                event_description: `Corrected payment: actual=${actualAmount}, admin_put=${adminPutAmount}, difference=${missed_amount}`,
                old_value: oldBalance,
                new_value: newShopBalance ? newShopBalance.balance_amount : null,
                edit_reason,
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
