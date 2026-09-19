const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    contactInfo: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    is_active: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model("message", messageSchema);