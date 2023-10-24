const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete','root','1234567890',{
    //node-complete
    dialect: 'mysql',
    host: 'localhost'
});

module.exports= sequelize;

