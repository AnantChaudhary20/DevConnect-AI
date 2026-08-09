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
        default: ""
    },

    linkedin: {
        type: String,
        default: ""
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