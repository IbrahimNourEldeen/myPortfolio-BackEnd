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
    refreshToken: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default:'admin'
    },
    CVFile: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model("user", userSchema);