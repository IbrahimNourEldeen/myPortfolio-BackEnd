const { default: mongoose } = require("mongoose");

const educationSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: String,
    subTitle: String,
    duration: {
        from: String,
        to: String
    },
    details: [
        {
            label: String,
            value: String
        }
    ]
})
module.exports = mongoose.model("education", educationSchema)