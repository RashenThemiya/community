const processPayment = require('../utils/processPayment');
const sequelize = require("../config/database"); 
const Shop = require('../models/Shop');

async function testProcessPayment() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');
        await sequelize.sync(); // Ensures models are properly synced

        const shopId = 'SHP003';
        const amountPaid = 50000;
        const paymentMethod = 'Cash';

        const shopExists = await Shop.findByPk(shopId);
        if (!shopExists) {
            console.warn(`⚠️ Shop ID ${shopId} does not exist. Skipping test.`);
            return;
        }

        const result = await processPayment(shopId, amountPaid, paymentMethod);
        console.log('✅ Test Result:', result);

    } catch (error) {
        console.error('❌ Test Error:', error.message);
        console.error(error.stack);
    } finally {
        if (sequelize?.connectionManager?.connected) {
            await sequelize.close();
            console.log('✅ Database connection closed.');
        } else {
            console.log('⚠️ No active database connection to close.');
        }
    }
}

testProcessPayment();
