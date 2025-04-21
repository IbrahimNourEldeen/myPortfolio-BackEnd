const { default: mongoose } = require("mongoose");

const socialSchema = mongoose.Schema({
    adminId:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required: true
    },
    linkedin: String,
    github: String,
    twitter: String,
    facebook: String,
    website: String,
    phoneNumber:String,
    email:String
});

module.exports = mongoose.model("social",socialSchema);