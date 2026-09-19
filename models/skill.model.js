const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'skillType',
        required: true
    },
    nameAr: String,
    nameEn: String,
    percent: Number,
    icon: String,
    color: String,
    order: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("skill", skillSchema);
