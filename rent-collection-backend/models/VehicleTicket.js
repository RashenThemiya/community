const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VehicleTicket = sequelize.define('VehicleTicket', {
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehicleType: {
    type: DataTypes.ENUM('Lorry', 'Van', 'Three-Wheeler', 'Motorbike', 'Car'),
    allowNull: false
  },
  ticketPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  byWhom: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'vehicle_tickets',
  timestamps: true
});

module.exports = VehicleTicket;
