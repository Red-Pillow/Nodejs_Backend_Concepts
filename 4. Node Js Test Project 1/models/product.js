const Sequelize = require("sequelize");

const sequelize = require('../util/database');

const Product = sequelize.define('products',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey: true
    },
    amount: {
        type:Sequelize.BIGINT,
        allowNull: false,
        unique: false,
    },
    productName: {
        type: Sequelize.STRING,
        unique: false,
    },
    categoryType: {
        type: Sequelize.STRING,
        unique: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Set the default value to the current date and time
      },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW, // Set the default value to the current date and time
    }
});

module.exports = Product;
