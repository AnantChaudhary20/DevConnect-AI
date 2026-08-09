const Comment = require("../models/Comment");
const Project = require("../models/Project");

// Add Comment
const addComment = async (req, res) => {

    try {

        const { text } = req.body;

        const project = await Project.findById(req.params.projectId);

        if (!project) {

            return res.status(404).json({
                success: false,
                message: "Project not found."
            });

        }

        const comment = await Comment.create({

            project: req.params.projectId,

            user: req.user.userId,

            text

        });

        return res.status(201).json({

            success: true,

            message: "Comment added successfully.",

            comment

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// Get Comments
const getComments = async (req, res) => {

    try {

        const comments = await Comment.find({

            project: req.params.projectId

        })

        .populate("user", "name profilePicture")

        .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            totalComments: comments.length,

            comments

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

// Delete Comment
const deleteComment = async (req, res) => {

    try {

        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {

            return res.status(404).json({

                success: false,

                message: "Comment not found."

            });

        }

        if (comment.user.toString() !== req.user.userId) {

            return res.status(403).json({

                success: false,

                message: "Unauthorized."

            });

        }

        await comment.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Comment deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    addComment,

    getComments,

    deleteComment

};