const { default: mongoose } = require("mongoose");

const skillsSchema = mongoose.Schema({
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required:true
    },
    technicalSkills: [
        {
            name: String,
            percent: String,
            icon: String,
            color: String
        }
    ],
    nonTechnicalSkills: [
        {
            name: String,
            percent: String,
            icon: String,
            color: String
        }
    ]
})
module.exports = mongoose.model("skill",skillsSchema);