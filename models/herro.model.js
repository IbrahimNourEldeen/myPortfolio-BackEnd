const { default: mongoose } = require("mongoose");

const herroSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: String,
    subTitle: String,
    description: String,
    avatar: {
        type: String,
        default: 'uploads/avatar/img.jpg'
    }, 
    CVFile: {
        type: String,
        default: null,
    },
})

module.exports = mongoose.model("herro", herroSchema);