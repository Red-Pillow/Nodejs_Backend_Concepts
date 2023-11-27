const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize("groupChat","root","1234567890",{
    dialect: 'mysql',//process.env.DB_TYPE,
    host: "localhost"
});

module.exports= sequelize;

