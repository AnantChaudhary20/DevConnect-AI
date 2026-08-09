const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 2000
        },

        tags: {
            type: [String],
            default: []
        },

        githubUrl: {
            type: String,
            default: "",
            trim: true
        },

        liveUrl: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            enum: [
                "Web Development",
                "Mobile Development",
                "AI / Machine Learning",
                "Data Science",
                "DevOps",
                "Cybersecurity",
                "Other"
            ],
            default: "Other"
        },

        status: {
            type: String,
            enum: [
                "Planning",
                "In Progress",
                "Completed"
            ],
            default: "Planning"
        },

        featured: {
            type: Boolean,
            default: false
        },

        images: {
            type: [String],
            default: []
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Project", projectSchema);