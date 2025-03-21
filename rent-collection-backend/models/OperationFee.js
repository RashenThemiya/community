const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./Shop');
const Invoice = require('./Invoice');

const OperationFee = sequelize.define('OperationFee', {
  operation_fee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shop_id: {
    type: DataTypes.STRING(6),
    references: {
      model: Shop,
      key: 'shop_id'
    },
  },
  invoice_id: {
    type: DataTypes.STRING,
    references: {
      model: Invoice,
      key: 'invoice_id'
    },
  },
  operation_amount: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  paid_amount: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0,
  },
  generate_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW, 
  },
  paid_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Unpaid', 'Paid', 'Partially Paid', 'Arrest'),
    defaultValue: 'Unpaid',
  },
}, {
  timestamps: true,
  tableName: 'operation_fees',
});

module.exports = OperationFee;
