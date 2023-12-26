const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ArchivedPrivateMessage = sequelize.define('archivedprivatemessage', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  message: Sequelize.STRING,
  multimedia: Sequelize.STRING,
  multimediaType: Sequelize.STRING,
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  senderName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  receiverName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  receiverId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = ArchivedPrivateMessage;
