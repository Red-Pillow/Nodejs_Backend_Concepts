const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ArchivedMessage = sequelize.define('archivedmessage', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  senderName: Sequelize.STRING,
  message: Sequelize.STRING,
  multimedia: Sequelize.STRING,
  multimediaType: Sequelize.STRING,
});

module.exports = ArchivedMessage;
