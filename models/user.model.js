const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: 1,
        unique: true
    },
    email: {
        type: String,
        required: 1,
        unique: true,
        validate: [validator.isEmail, "must be a valid email"]
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model("user", userSchema);