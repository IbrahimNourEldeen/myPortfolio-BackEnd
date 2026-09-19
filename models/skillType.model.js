const mongoose = require('mongoose');

const skillTypeSchema = new mongoose.Schema({
    nameAr: {
        type: String,
        required: true,
    },
    nameEn: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("skillType", skillTypeSchema);
