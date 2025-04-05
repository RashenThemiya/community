const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Price = sequelize.define("Price", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY, // Stores only date
        allowNull: false
    }
});

// Define relationship: A Product has many Price records

module.exports = Price;
