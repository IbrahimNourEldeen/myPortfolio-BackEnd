const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: 1,
    },
    email: {
        type: String,
        required: 1,
        unique: true,
        validate: [validator.isEmail, "must be a valid email"]
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
    },
    CVFile: {
        type: String,
        default: null,
    },
    avatar: {
        type: String,
        default: 'uploads/avatar/img.jpg'
    },
    info: {
        title: String,
        subTitle: String,
        description: String
    },
    social: {
        linkedin: String,
        github: String,
        twitter: String,
        facebook: String,
        website: String,
        phoneNumber: String,
        email: String
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
    ],
    projects: [
        {
            title: String,
            description: String,
            technologies: [String],
            types: String,
            githubRepo: String,
            liveDemo: String,
            poster: [String],
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    herro: {
        title: String,
        subTitle: String,
        description: String,
    },
    experiences: [
        {
            position: String,
            company: String,
            companyLogo: String,
            location: String,
            duration: {
                from: String,
                to: String
            },
            responsibilities: [String]
        }
    ],
    education: [
        {
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
        }
    ]
});

module.exports = mongoose.model("user", userSchema);