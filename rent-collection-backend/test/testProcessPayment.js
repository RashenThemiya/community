const { 
    processPaymentByShopId, 
    processPaymentByInvoiceId, 
    runInvoicePaymentProcessWithoutAddingToShopBalance
} = require('../utils/processPayment');

const sequelize = require("../config/database"); 
const Shop = require('../models/Shop');
const Invoice = require('../models/Invoice');

async function testProcessPayment() {
    try {
        console.log('✅ Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
        await sequelize.sync(); // Ensures models are properly synced

        const shopId = 'S002';
        const invoiceId = 'INV-S002-202503';
        const amountPaid = 40;
        const paymentMethod = 'Cash';

        const shopExists = await Shop.findByPk(shopId);
        if (!shopExists) {
            console.warn(`⚠️ Shop ID ${shopId} does not exist. Skipping test.`);
            return;
        }

        const invoiceExists = await Invoice.findByPk(invoiceId);
        if (!invoiceExists) {
            console.warn(`⚠️ Invoice ID ${invoiceId} does not exist. Skipping test.`);
            return;
        }

        // Testing processPaymentByShopId
        console.log('✅ Testing processPaymentByShopId...');
        const resultShop = await processPaymentByShopId(shopId, amountPaid, paymentMethod);
        console.log('✅ Result (Shop Payment):', resultShop);

        // Testing processPaymentByInvoiceId
        console.log('✅ Testing processPaymentByInvoiceId...');
        const resultInvoice = await processPaymentByInvoiceId(invoiceId, amountPaid, paymentMethod);
        console.log('✅ Result (Invoice Payment):', resultInvoice);
    } catch (error) {
        console.error('❌ Test Error:', error.message);
        console.error(error.stack);
    }
}

async function testRunInvoicePaymentProcessWithoutAddingToShopBalance() {
    try {
        const shopId = 'SHP005'; // Update with a valid shop ID

        const shopExists = await Shop.findByPk(shopId);
        if (!shopExists) {
            console.warn(`⚠️ Shop ID ${shopId} does not exist. Skipping test.`);
            return;
        }

        // Testing runInvoicePaymentProcessWithoutAddingToShopBalance
        console.log('✅ Testing runInvoicePaymentProcessWithoutAddingToShopBalance...');
        const result = await runInvoicePaymentProcessWithoutAddingToShopBalance(shopId);
        console.log('✅ Result:', result);
    } catch (error) {
        console.error('❌ Test Error:', error.message);
        console.error(error.stack);
    }
}

(async function runTests() {
    try {
        await testProcessPayment();
        await testRunInvoicePaymentProcessWithoutAddingToShopBalance();
    } catch (error) {
        console.error('❌ Error running tests:', error.message);
    } finally {
        await sequelize.close();
        console.log('✅ Database connection closed.');
    }
})();