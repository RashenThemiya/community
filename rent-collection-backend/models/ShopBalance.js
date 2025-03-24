const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shop = require('./Shop');

const ShopBalance = sequelize.define('ShopBalance', {
  shop_id: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    references: {
      model: Shop,
      key: 'shop_id'
    },
    onDelete: 'CASCADE',  // ✅ Deletes ShopBalance when Shop is deleted
  },
  balance_amount: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0,
  },
  last_updated: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'shop_balances',
});


module.exports = ShopBalance;
