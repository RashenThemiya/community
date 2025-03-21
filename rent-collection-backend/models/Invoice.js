const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./Shop');

const Invoice = sequelize.define('Invoice', {
  invoice_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    autoIncrement: false,
  },
  shop_id: {
    type: DataTypes.STRING(6),
    allowNull: false,
    references: {
      model: Shop,
      key: 'shop_id'
    },
    onDelete: 'CASCADE',
  },
  month_year: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  rent_amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  operation_fee: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0,
  },
  vat_amount: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0,
  },
  previous_balance: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0,
  },
  fines: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0,
  },
  total_arrears: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Arrest', 'Partially Paid'),
    defaultValue: 'Unpaid',
  },
  printedtime: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'invoices',
});

Shop.hasMany(Invoice, { foreignKey: 'shop_id' });
Invoice.belongsTo(Shop, { foreignKey: 'shop_id' });

module.exports = Invoice;
