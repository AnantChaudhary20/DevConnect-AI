const User = require("../models/User");
const intelligenceService = require("../services/intelligenceService");

const analyzeResume = async (req, res, next) => {
    try {
        const { resumeText, targetRole } = req.body;

        if (
            typeof resumeText !== "string" ||
            resumeText.trim().length < 80
        ) {
            return res.status(400).json({
                success: false,
                message: "Resume text must contain at least 80 characters."
            });
        }

        const result =
            await intelligenceService.analyzeResume(
                resumeText,
                targetRole
            );

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getRecommendations = async (req, res, next) => {
    try {
        const limit =
            Math.min(
                Math.max(
                    Number(req.query.limit) || 5,
                    1
                ),
                20
            );

        const currentUser =
            await User.findById(
                req.user.userId
            ).select("skills");

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const users =
            await User.find({
                _id: { $ne: req.user.userId }
            })
                .select(
                    "name bio skills github linkedin location profilePicture"
                )
                .lean();

        const result =
            await intelligenceService.getRecommendations(
                currentUser.skills || [],
                users,
                limit
            );

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const algorithmDemo = async (req, res, next) => {
    try {
        const result =
            await intelligenceService.runAlgorithmDemo(
                req.body
            );

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    analyzeResume,
    getRecommendations,
    algorithmDemo
};
