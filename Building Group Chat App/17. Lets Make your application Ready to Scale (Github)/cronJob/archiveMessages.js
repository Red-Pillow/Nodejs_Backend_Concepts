const cron = require('node-cron');
const Message = require('../models/chatbox');
const PrivateMessage = require('../models/privateChatbox');
const ArchivedMessage = require('../models/archivedMessage');
const ArchivedPrivateMessage = require('../models/archivedPrivateMessage');
const { Op } = require('sequelize');

module.exports = function archiveMessages() {
  cron.schedule('0 0 * * *', async () => {
    try {
      // Move 1-day-old messages from Message to ArchivedMessage
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const oldMessages = await Message.findAll({
        where: {
          createdAt: {
            [Op.lt]: oneDayAgo,
          },
        },
      });

      if (oldMessages.length > 0) {
        await ArchivedMessage.bulkCreate(oldMessages.map((msg) => msg.toJSON()));
        await Message.destroy({
          where: {
            createdAt: {
              [Op.lt]: oneDayAgo,
            },
          },
        });
      }

      // Move 1-day-old messages from PrivateMessage to ArchivedPrivateMessage
      const oldPrivateMessages = await PrivateMessage.findAll({
        where: {
          createdAt: {
            [Op.lt]: oneDayAgo,
          },
        },
      });

      if (oldPrivateMessages.length > 0) {
        await ArchivedPrivateMessage.bulkCreate(oldPrivateMessages.map((msg) => msg.toJSON()));
        await PrivateMessage.destroy({
          where: {
            createdAt: {
              [Op.lt]: oneDayAgo,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error archiving messages:', error);
    }
  });
};
