const Sequelize = require("sequelize");

const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey: true
    },
    name: {
        type:Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
    },
    phonenumber: {
        type: Sequelize.BIGINT,
        unique: true,
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

module.exports = User;
