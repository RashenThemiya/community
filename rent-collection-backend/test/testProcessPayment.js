const { processPaymentByShopId, processPaymentByInvoiceId } = require('../utils/processPayment');
const sequelize = require("../config/database"); 
const Shop = require('../models/Shop');
const Invoice = require('../models/Invoice');

(async function testProcessPayment() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
        await sequelize.sync(); // Ensures models are properly synced

        const shopId = 'SHP001';
        const invoiceId = 'INV-SHP009-202503';
        const amountPaid = 405.5;
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

        console.log('✅ Testing processPaymentByShopId...');
        const resultShop = await processPaymentByShopId(shopId, amountPaid, paymentMethod);
        console.log('✅ Result (Shop Payment):', resultShop);

        console.log('✅ Testing processPaymentByInvoiceId...');
        const resultInvoice = await processPaymentByInvoiceId(invoiceId, amountPaid, paymentMethod);
        console.log('✅ Result (Invoice Payment):', resultInvoice);

    } catch (error) {
        console.error('❌ Test Error:', error.message);
        console.error(error.stack);
    } finally {
        await sequelize.close();
        console.log('✅ Database connection closed.');
    }
})();
