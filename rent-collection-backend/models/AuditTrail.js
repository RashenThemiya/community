const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./Shop'); // Assuming a Shop model exists
const Invoice = require('./Invoice'); // Assuming an Invoice model exists

const AuditTrail = sequelize.define('AuditTrail', {
  audit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shop_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Shop,
      key: 'shop_id',
    },
    onDelete: 'CASCADE',
  },
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: Invoice,
      key: 'invoice_id',
    },
    onDelete: 'SET NULL',
  },
  event_type: {
    type: DataTypes.ENUM(
      'Invoice Generated',
      'Payment Made',
      'Partially Paid',
      'Arrears Updated',
      'Fine Applied',
      'Arrest Action',
      'VAT Updated',
      'Operation Fee Updated',
      'Manual Edit',
      'Correction'
    ),
    allowNull: false,
  },
  event_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  old_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  new_value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  edit_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  event_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  user_actioned: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'audit_trail',
});

module.exports = AuditTrail;
