const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    linkedin: String,
    github: String,
    twitter: String,
    facebook: String,
    website: String,
    phoneNumber: String,
    email: String
});

module.exports = mongoose.model("social", socialSchema);
