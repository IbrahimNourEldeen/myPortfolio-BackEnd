const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: 1,
        unique: true,
        validate: [validator.isEmpty, "name is required"]
    },
    email: {
        type: String,
        required: 1,
        unique: true,
        validate: [validator.isEmail, "must be a valid email"]
    },
    password: {
        type: String,
        required: true,
        validate: [validator.isEmpty, "password is required"]
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        validate: [validator.isDate, "must be a valid date"]
    }
});

module.exports = mongoose.model("user", userSchema);