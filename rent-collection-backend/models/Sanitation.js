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
  }
}, {
  tableName: 'sanitation',
  timestamps: true  // This will automatically create createdAt and updatedAt fields
});

module.exports = Sanitation;
