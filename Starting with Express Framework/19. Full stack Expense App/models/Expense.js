const Sequelize = require("sequelize");

const sequelize = require('../util/database');

const Expense = sequelize.define('expense',{
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
    description: {
        type: Sequelize.STRING,
        unique: false,
    },
    expenseType: {
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

module.exports = Expense;
