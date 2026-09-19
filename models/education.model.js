const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    titleAr: String,
    titleEn: String,
    subTitleAr: String,
    subTitleEn: String,
    durationFrom: String,
    durationTo: String,
    details: [
        {
            labelAr: String,
            labelEn: String,
            value: String
        }
    ],
    order: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("education", educationSchema);
