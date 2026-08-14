const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    emailVerified: {
        type: Boolean,
        default: true
    },

    emailVerificationCode: {
        type: String,
        default: ""
    },

    emailVerificationExpires: {
        type: Date,
        default: null
    },

    password: {
        type: String,
        required: true
    },

    bio: {
        type: String,
        default: ""
    },

    skills: {
        type: [String],
        default: []
    },

    github: {
        type: String,
        default: "",
        validate: {
            validator: (value) => !value || /^https:\/\/github\.com\/[A-Za-z0-9-]+\/?$/.test(value),
            message: "GitHub URL must look like https://github.com/username"
        }
    },

    linkedin: {
        type: String,
        default: "",
        validate: {
            validator: (value) => !value || /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9._-]+\/?$/.test(value),
            message: "LinkedIn URL must look like https://www.linkedin.com/in/username"
        }
    },

    portfolio: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    profilePicture: {
        type: String,
        default: ""
    },
    bookmarks: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }
],
followers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
],

following: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
]
},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);