const mongoose = require('mongoose');

const projectTypeSchema = new mongoose.Schema({
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

module.exports = mongoose.model("projectType", projectTypeSchema);
