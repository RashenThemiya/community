const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./Product");

const Price = sequelize.define("Price", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: "id"
        },
        onDelete: "CASCADE"
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
Product.hasMany(Price, { foreignKey: "product_id", onDelete: "CASCADE" });
Price.belongsTo(Product, { foreignKey: "product_id" });

module.exports = Price;
