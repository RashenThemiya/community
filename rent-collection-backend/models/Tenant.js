const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./Shop'); // Import Shop model

const Tenant = sequelize.define('Tenant', {
  tenant_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shop_id: {
    type: DataTypes.STRING(6),
    allowNull: false, // A tenant must be linked to a shop
    references: {
      model: Shop,
      key: 'shop_id'
    },
    onDelete: 'CASCADE', // If shop is deleted, remove the tenant
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  timestamps: true,
  tableName: 'tenants',
});

// Relationships
Shop.hasOne(Tenant, { foreignKey: 'shop_id' }); // One shop can have one tenant
Tenant.belongsTo(Shop, { foreignKey: 'shop_id' }); // Each tenant belongs to a shop

module.exports = Tenant;
