const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    positionAr: String,
    positionEn: String,
    company: String,
    companyLogo: String,
    location: String,
    durationFrom: String,
    durationTo: String,
    responsibilitiesAr: [String],
    responsibilitiesEn: [String],
    order: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("experience", experienceSchema);
