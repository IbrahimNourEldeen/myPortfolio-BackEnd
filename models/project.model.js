const mongoose = require('mongoose');
const validator=require('validator')

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: 1,
    },
    description: {
        type: String,
        required: 1,
    },
    technologies: {
        type: [String],
        required: true,
    },
    repo: {
        type: String,
        required: 1,
    },
    demo: {
        type: String,
        required: 1,
    },
    createdAt: {
        type: Date,
        default:Date.now,
    }
});

module.exports = mongoose.model("project", projectSchema);