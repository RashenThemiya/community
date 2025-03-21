const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import
const Payment = require('../models/Payment');
const ShopBalance = require('../models/ShopBalance');
const Invoice = require('../models/Invoice');
const Rent = require('../models/Rent');
const OperationFee = require('../models/OperationFee');
const Fine = require('../models/Fine');
const AuditTrail = require('../models/AuditTrail');
const Vat = require('../models/Vat');

async function processPayment(shopId, amountPaid, paymentMethod) {
    const t = await sequelize.transaction(); // Begin transaction

    try {
        // Ensure amountPaid is properly formatted as a float with two decimal places
        amountPaid = parseFloat(amountPaid);
        if (isNaN(amountPaid) || amountPaid <= 0) {
            throw new Error("Invalid payment amount.");
        }

        const payment = await Payment.create({
            shop_id: shopId,
            amount_paid: amountPaid.toFixed(2),
            payment_date: new Date(),
            payment_method: paymentMethod
        }, { transaction: t });

        let shopBalance = await ShopBalance.findByPk(shopId, { transaction: t });

        if (!shopBalance) {
            shopBalance = await ShopBalance.create({
                shop_id: shopId,
                balance_amount: amountPaid.toFixed(2),
                last_updated: new Date()
            }, { transaction: t });
        } else {
            shopBalance.balance_amount = parseFloat(shopBalance.balance_amount) + amountPaid;
            shopBalance.balance_amount = parseFloat(shopBalance.balance_amount.toFixed(2));
            shopBalance.last_updated = new Date();
            await shopBalance.save({ transaction: t });
        }

        await AuditTrail.create({
            shop_id: shopId,
            event_type: 'Payment Made',
            event_description: `Payment of ${amountPaid.toFixed(2)} received via ${paymentMethod}`,
            user_actioned: 'System'
        }, { transaction: t });

        const invoices = await Invoice.findAll({
            where: {
                shop_id: shopId,
                status: ['Arrest', 'Unpaid', 'Partially Paid']
            },
            order: [['status', 'ASC'], ['createdAt', 'ASC']],
            transaction: t
        });

        let remainingBalance = shopBalance.balance_amount;

        for (const invoice of invoices) {
            const rent = await Rent.findOne({ where: { invoice_id: invoice.invoice_id }, transaction: t });
            if (rent && rent.status !== 'Paid' && remainingBalance > 0) {
                const dueAmount = parseFloat(rent.rent_amount) - parseFloat(rent.paid_amount);
                const payment = Math.min(remainingBalance, dueAmount);
                rent.paid_amount = parseFloat(rent.paid_amount) + payment;
                rent.paid_amount = parseFloat(rent.paid_amount.toFixed(2));
                remainingBalance -= payment;
                rent.status = (rent.paid_amount >= rent.rent_amount) ? 'Paid' : 'Partially Paid';
                rent.paid_date = new Date();
                await rent.save({ transaction: t });
            }

            const operationFee = await OperationFee.findOne({ where: { invoice_id: invoice.invoice_id }, transaction: t });
            if (operationFee && operationFee.status !== 'Paid' && remainingBalance > 0) {
                const dueAmount = parseFloat(operationFee.operation_amount) - parseFloat(operationFee.paid_amount);
                const payment = Math.min(remainingBalance, dueAmount);
                operationFee.paid_amount = parseFloat(operationFee.paid_amount) + payment;
                operationFee.paid_amount = parseFloat(operationFee.paid_amount.toFixed(2));
                remainingBalance -= payment;
                operationFee.status = (operationFee.paid_amount >= operationFee.operation_amount) ? 'Paid' : 'Partially Paid';
                operationFee.paid_date = new Date();
                await operationFee.save({ transaction: t });
            }

            const vat = await Vat.findOne({ where: { invoice_id: invoice.invoice_id }, transaction: t });
            if (vat && vat.status !== 'Paid' && remainingBalance > 0) {
                const dueAmount = parseFloat(vat.vat_amount) - parseFloat(vat.paid_amount);
                const payment = Math.min(remainingBalance, dueAmount);
                vat.paid_amount = parseFloat(vat.paid_amount) + payment;
                vat.paid_amount = parseFloat(vat.paid_amount.toFixed(2));
                remainingBalance -= payment;
                vat.status = (vat.paid_amount >= vat.vat_amount) ? 'Paid' : 'Partially Paid';
                vat.paid_date = new Date();
                await vat.save({ transaction: t });
            }

            const fine = await Fine.findOne({ where: { invoice_id: invoice.invoice_id }, transaction: t });
            if (fine && fine.status !== 'Paid' && remainingBalance > 0) {
                const dueAmount = parseFloat(fine.fine_amount) - parseFloat(fine.paid_amount);
                const payment = Math.min(remainingBalance, dueAmount);
                fine.paid_amount = parseFloat(fine.paid_amount) + payment;
                fine.paid_amount = parseFloat(fine.paid_amount.toFixed(2));
                remainingBalance -= payment;
                fine.status = (fine.paid_amount >= fine.fine_amount) ? 'Paid' : 'Partially Paid';
                fine.paid_date = new Date();
                await fine.save({ transaction: t });
            }

            shopBalance.balance_amount = remainingBalance;
            shopBalance.balance_amount = parseFloat(shopBalance.balance_amount.toFixed(2));
            shopBalance.last_updated = new Date();
            await shopBalance.save({ transaction: t });

            const rentStatus = rent ? rent.status : 'Paid';
            const operationFeeStatus = operationFee ? operationFee.status : 'Paid';
            const vatStatus = vat ? vat.status : 'Paid';
            const fineStatus = fine ? fine.status : 'Paid';

            if (rentStatus === 'Paid' && operationFeeStatus === 'Paid' && vatStatus === 'Paid' && fineStatus === 'Paid') {
                invoice.status = 'Paid';
            } else if (rentStatus === 'Arrest' || operationFeeStatus === 'Arrest' || vatStatus === 'Arrest' || fineStatus === 'Arrest') {
                invoice.status = 'Arrest';
            } else {
                invoice.status = 'Partially Paid';
            }

            await invoice.save({ transaction: t });

            await AuditTrail.create({
                shop_id: shopId,
                event_type: invoice.status === 'Paid' ? 'Payment Made' : 'Partially Paid',
                event_description: `Invoice ${invoice.invoice_id} updated to ${invoice.status}`,
                user_actioned: 'System'
            }, { transaction: t });

            if (remainingBalance <= 0) break;
        }

        await t.commit();
        return { success: true, message: 'Payment processed successfully' };
    } catch (error) {
        await t.rollback();
        console.error('❌ Payment Processing Error:', error);
        return { success: false, message: 'Payment processing failed' };
    }
}

module.exports = processPayment;
