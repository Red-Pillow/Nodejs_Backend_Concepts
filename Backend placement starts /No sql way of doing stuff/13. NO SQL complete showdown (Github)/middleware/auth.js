const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticate = async (req, res, next) => {
    try {
        // console.log("auth^&^^$");
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization token missing' });
        }

        const decodedToken = jwt.verify(token, 'secretkey');
        // console.log(decodedToken.userId, "%^&* req.user");

        const user = await User.findById(decodedToken.userId);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = {
    authenticate
};
