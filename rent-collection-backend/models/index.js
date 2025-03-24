const sequelize = require('../config/database');
const Shop = require('./Shop');
const ShopBalance = require('./ShopBalance');
const Fine = require('./Fine');
const Invoice = require('./Invoice');
const OperationFee = require('./OperationFee');
const Rent = require('./Rent');
const Tenant = require('./Tenant');
const Vat = require('./Vat'); // ✅ Corrected import case
const Payment = require('./Payment');

// Define Associations
Shop.hasOne(ShopBalance, { foreignKey: 'shop_id', onDelete: 'CASCADE', hooks: true });
ShopBalance.belongsTo(Shop, { foreignKey: 'shop_id' });

Shop.hasMany(Fine, { foreignKey: 'shop_id', onDelete: 'CASCADE', hooks: true });
Fine.belongsTo(Shop, { foreignKey: 'shop_id' });

Invoice.hasMany(Fine, { foreignKey: 'invoice_id', onDelete: 'CASCADE', hooks: true });
Fine.belongsTo(Invoice, { foreignKey: 'invoice_id' });

Shop.hasMany(Invoice, { foreignKey: 'shop_id', onDelete: 'CASCADE', hooks: true });
Invoice.belongsTo(Shop, { foreignKey: 'shop_id' });

Shop.hasMany(OperationFee, { foreignKey: 'shop_id', onDelete: 'CASCADE', hooks: true });
OperationFee.belongsTo(Shop, { foreignKey: 'shop_id' });

Invoice.hasMany(OperationFee, { foreignKey: 'invoice_id', onDelete: 'CASCADE', hooks: true });
OperationFee.belongsTo(Invoice, { foreignKey: 'invoice_id' });

Shop.hasMany(Rent, { foreignKey: 'shop_id', onDelete: 'CASCADE', hooks: true });
Rent.belongsTo(Shop, { foreignKey: 'shop_id' });

Invoice.hasMany(Rent, { foreignKey: 'invoice_id', onDelete: 'CASCADE', hooks: true });
Rent.belongsTo(Invoice, { foreignKey: 'invoice_id' });

Shop.hasOne(Tenant, { foreignKey: 'shop_id', onDelete: 'CASCADE', hooks: true });
Tenant.belongsTo(Shop, { foreignKey: 'shop_id' });

Shop.hasMany(Vat, { foreignKey: 'shop_id', onDelete: 'CASCADE', hooks: true });
Vat.belongsTo(Shop, { foreignKey: 'shop_id' });

Invoice.hasMany(Vat, { foreignKey: 'invoice_id', onDelete: 'CASCADE', hooks: true });
Vat.belongsTo(Invoice, { foreignKey: 'invoice_id' });

// Export models
module.exports = { sequelize, Shop, ShopBalance, Fine, Invoice, OperationFee, Rent, Tenant, Vat, Payment };
