const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./Shop');
const Invoice = require('./Invoice');

const Fine = sequelize.define('Fine', {
  fine_id: {
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
    onDelete: 'CASCADE'
  },
  invoice_id: {
    type: DataTypes.STRING,
    references: {
      model: Invoice,
      key: 'invoice_id'
    },
    onDelete: 'CASCADE'
  },
  fine_amount: {
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
  status: {
    type: DataTypes.ENUM('Unpaid', 'Paid', 'Partially Paid', 'Arrest'),
    defaultValue: 'Unpaid',
  },
}, {
  timestamps: true,
  tableName: 'fines',
});


module.exports = Fine;
