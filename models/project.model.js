const mongoose = require('mongoose');
const projectSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    technologies: {
        type: [String],
    },
    types:String,
    githubRepo: {
        type: String,
    },
    liveDemo: String,
    poster: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("project", projectSchema);