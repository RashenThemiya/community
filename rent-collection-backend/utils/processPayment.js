const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Payment = require('../models/Payment');
const ShopBalance = require('../models/ShopBalance');
const Invoice = require('../models/Invoice');
const Rent = require('../models/Rent');
const OperationFee = require('../models/OperationFee');
const Fine = require('../models/Fine');
const AuditTrail = require('../models/AuditTrail');
const Vat = require('../models/VAT');

async function processPaymentByShopId(shopId, amountPaid, paymentMethod) {
    return processPayment(shopId, amountPaid, paymentMethod, null);
}

async function processPaymentByInvoiceId(invoiceId, amountPaid, paymentMethod) {
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
        return { success: false, message: 'Invoice not found' };
    }
    return processPayment(invoice.shop_id, amountPaid, paymentMethod, invoiceId);
}

async function processPayment(shopId, amountPaid, paymentMethod, invoiceId = null) {
    const t = await sequelize.transaction();
    try {
        amountPaid = parseFloat(amountPaid);
        if (isNaN(amountPaid) || amountPaid <= 0) {
            throw new Error("Invalid payment amount.");
        }

        // Create Payment Record
        const payment = await Payment.create({
            shop_id: shopId,
            amount_paid: amountPaid.toFixed(2),
            payment_date: new Date(),
            payment_method: paymentMethod,
            invoice_id: invoiceId
        }, { transaction: t });

        // Update or Create Shop Balance
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

        // Add Audit Trail Entry
        await AuditTrail.create({
            shop_id: shopId,
            event_type: 'Payment Made',
            event_description: `Payment of ${amountPaid.toFixed(2)} received via ${paymentMethod}`,
            user_actioned: 'System'
        }, { transaction: t });

        // Fetch invoices that need payment
        let invoices;
        if (false) { // Change this condition to true if you want to process only specific invoices
            invoices = await Invoice.findAll({ where: { invoice_id: invoiceId }, transaction: t });
        } else {
            invoices = await Invoice.findAll({
                where: {
                    shop_id: shopId,
                    status: ['Arrest', 'Unpaid', 'Partially Paid']
                },
                order: [['status', 'ASC'], ['createdAt', 'ASC']],
                transaction: t
            });
        }

        // Process payments for each invoice
        let remainingBalance = shopBalance.balance_amount; //here shopbalnce<0 dont do paymnets
        for (const invoice of invoices) {
            if (remainingBalance <= 0) break;
            remainingBalance = await processInvoicePayments(invoice, remainingBalance, t);
            
        }

        // Update Shop Balance
        shopBalance.balance_amount = remainingBalance;
        shopBalance.last_updated = new Date();
        await shopBalance.save({ transaction: t });

        await t.commit();
        return { success: true, message: 'Payment processed successfully' };
    } catch (error) {
        await t.rollback();
        console.error('❌ Payment Processing Error:', error);
        return { success: false, message: 'Payment processing failed' };
    }
}

async function processInvoicePayments(invoice, remainingBalance, t) {
  let allPaid = true;  // Assume all records are fully paid
  let hasUnpaidOrPartial = false; // Flag for partially/unpaid records

  for (const model of [Rent, OperationFee, Vat, Fine]) {
    
      const records = await model.findAll({
          where: {
              invoice_id: invoice.invoice_id,
              status: { [Sequelize.Op.in]: ['Unpaid', 'Partially Paid', 'Arrest'] }
          },
          transaction: t
      });

      if (records.length === 0) continue; // Skip if no relevant records

      for (const record of records) {
          if (remainingBalance <= 0) break; // Stop processing if no balance left

          const dueAmount = parseFloat(record[Object.keys(record.dataValues).find(key => key.includes('amount'))]) - parseFloat(record.paid_amount);
          const payment = Math.min(remainingBalance, dueAmount);

          record.paid_amount = parseFloat(record.paid_amount) + payment;
          record.paid_amount = parseFloat(record.paid_amount.toFixed(2));
          remainingBalance -= payment;
        
          // Update record status
          if (record.paid_amount >= dueAmount) {
              record.status = 'Paid';
          } else {
              record.status = 'Partially Paid';
              allPaid = false;  // At least one record is not fully paid
              hasUnpaidOrPartial = true;
          }

          record.paid_date = new Date();
          await record.save({ transaction: t });
      }
  }

  // Final invoice status update
  if (allPaid && !hasUnpaidOrPartial) {
      invoice.status = 'Paid';
  } else if (hasUnpaidOrPartial) {
      invoice.status = 'Partially Paid';
  }

  await invoice.save({ transaction: t });
  return remainingBalance;
}


async function runInvoicePaymentProcessWithoutAddingToShopBalance(shopId) {
    const t = await sequelize.transaction();
    try {
        // Fetch unpaid invoices for the given shop
        const invoices = await Invoice.findAll({
            where: {
                shop_id: shopId,
                status: { [Sequelize.Op.in]: ['Unpaid', 'Partially Paid', 'Arrest'] }
            },
            order: [['createdAt', 'ASC']],
            transaction: t
        });

        if (!invoices.length) {
            await t.rollback();
            return { success: false, message: 'No unpaid invoices found for this shop.' };
        }

        // Get shop balance (without modifying it)
        const shopBalance = await ShopBalance.findByPk(shopId, { transaction: t });
        if (!shopBalance || shopBalance.balance_amount <= 0) {
            await t.rollback();
            return { success: false, message: 'No sufficient balance for payment processing' };
        }

        let remainingBalance = shopBalance.balance_amount;

        // Process invoices without updating ShopBalance
        for (const invoice of invoices) {
            remainingBalance = await processInvoicePayments(invoice, remainingBalance, t);
            if (remainingBalance <= 0) break;
        }
        await shopBalance.update(
            { balance_amount: remainingBalance },
            { transaction: t }
        );
        await t.commit();
        return { success: true, message: 'Invoice payment process completed without modifying shop balance.' };
    } catch (error) {
        await t.rollback();
        console.error('❌ Invoice Payment Processing Error:', error);
        return { success: false, message: 'Invoice payment processing failed' };
    }
}

module.exports = { 
    processPaymentByShopId, 
    processPaymentByInvoiceId, 
    processInvoicePayments, 
    runInvoicePaymentProcessWithoutAddingToShopBalance
};


