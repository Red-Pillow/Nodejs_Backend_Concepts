const express = require('express');
const chatController = require('../controllers/chat');
const router = express.Router();

router.get('/get-chat-history/:startId', chatController.getChatHistory);
router.post('/send-message', chatController.sendMessage);

module.exports = router;
