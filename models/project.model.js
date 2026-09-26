const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projectType',
        required: true
    },
    titleAr: String,
    titleEn: String,
    descriptionAr: String,
    descriptionEn: String,
    technologies: [String],
    githubRepo: String,
    liveDemo: String,
    poster: [String],
    priority: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("project", projectSchema);
