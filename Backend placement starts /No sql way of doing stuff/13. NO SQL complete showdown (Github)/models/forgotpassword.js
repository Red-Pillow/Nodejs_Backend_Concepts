const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        required: true,
    },
    expiresBy: {
        type: Date,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
