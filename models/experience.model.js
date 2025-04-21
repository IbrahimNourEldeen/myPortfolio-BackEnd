const { default: mongoose } = require("mongoose");

const experienceSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    position: String,
    company: String,
    companyLogo :String,
    location :String,
    duration: {
        from: String,
        to: String
    },
    responsibilities:[String]
})
module.exports = mongoose.model("experience",experienceSchema);