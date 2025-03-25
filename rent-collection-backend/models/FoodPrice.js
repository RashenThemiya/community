const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


//here we are using food_id and price_date as the composite primary key
const FoodPrice = sequelize.define('FoodPrice', {
    food_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    food_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    price_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'food_prices',
    timestamps: false
});

module.exports = FoodPrice;
