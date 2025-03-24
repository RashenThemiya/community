const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./Shop'); 
const Invoice = require('./Invoice');

const AuditTrail = sequelize.define('AuditTrail', {
  audit_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shop_id: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: Shop,
      key: 'shop_id',
    },
    onDelete: 'SET NULL', 
  },
  invoice_id: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: Invoice,
      key: 'invoice_id',
    },
    onDelete: 'SET NULL', // ✅ Invoice deletion sets the field to NULL, but doesn't delete the audit record
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

// Define relationships (but without cascading deletion)
Shop.hasMany(AuditTrail, { foreignKey: 'shop_id', onDelete: 'SET NULL', hooks: true });
AuditTrail.belongsTo(Shop, { foreignKey: 'shop_id' });

Invoice.hasMany(AuditTrail, { foreignKey: 'invoice_id', onDelete: 'SET NULL', hooks: true });
AuditTrail.belongsTo(Invoice, { foreignKey: 'invoice_id' });

module.exports = AuditTrail;
