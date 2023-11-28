const Chat = require('../models/chat');
const { Sequelize } = require('sequelize');

function parseJwt (token) {
    if (!token){
        return null
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
}

// const getChatHistory = async (req, res) => {
//     try {
//         const chatHistory = await Chat.findAll({ order: [['timestamp', 'ASC']] });
//         console.log(chatHistory)
//         res.status(200).json(chatHistory);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

const getChatHistory = async (req, res) => {
    try {
        console.log(req)
        const startId = req.params.startId; // Assuming the frontend sends the id in the request parameters
        console.log(startId,"startId")
        const chatHistory = await Chat.findAll({
            where: {
                id: {
                    [Sequelize.Op.gte]: startId,
                },
            },
            order: [['id', 'DESC']],
            limit: 10,
        });
        
        console.log(chatHistory);
        res.status(200).json(chatHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




const sendMessage = async (req, res) => {
    try {console.log(req)
        const token = req.body.Authorization;
        const message = req.body.message;
        //console.log(message,"9999")
        decoded = parseJwt (token)
        const Id = decoded.userId
        const sender = decoded.name

        if (!sender || !message) {
            return res.status(400).json({ message: 'message is a required fields' });
        }

        const newMessage = await Chat.create({ sender, message });
        
        res.status(200).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getChatHistory,
    sendMessage

};
