const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sanitation = sequelize.define('Sanitation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  byWhom: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'sanitation',
  timestamps: true
});

module.exports = Sanitation;
