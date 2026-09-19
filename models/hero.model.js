const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    titleAr: String,
    titleEn: String,
    subTitleAr: String,
    subTitleEn: String,
    descriptionAr: String,
    descriptionEn: String,
});

module.exports = mongoose.model("hero", heroSchema);
