const mongoose = require('mongoose');
const validator = require('validator')

const messageSchema = mongoose.Schema({
    name: {
        type: String,
        required: 1,
    },
    email: {
        type: String,
        required: 1,
        validate: [validator.isEmail, "must be a valid email"]
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default:Date.now,
    }
});

module.exports = mongoose.model("message", messageSchema);