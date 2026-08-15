const User = require("../models/User");
const intelligenceService = require("../services/intelligenceService");

const health = async (req, res) => {
    const result = await intelligenceService.getPythonHealth();
    return res.status(result.reachable ? 200 : 503).json({ success: result.reachable, python: result });
};

const analyzeResume = async (req, res, next) => {
    try {
        const { resumeText, targetRole } = req.body;
        if (typeof resumeText !== "string" || resumeText.trim().length < 80) {
            return res.status(400).json({ success: false, message: "Resume text must contain at least 80 characters." });
        }
        const result = await intelligenceService.analyzeResume(resumeText, targetRole);
        return res.status(200).json(result);
    } catch (error) { next(error); }
};

const analyzeResumePdf = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a PDF resume." });
        }

        const isPdf =
            req.file.mimetype === "application/pdf" ||
            /\.pdf$/i.test(req.file.originalname || "");

        if (!isPdf) {
            return res.status(400).json({ success: false, message: "Only PDF files are supported." });
        }

        let resumeText = "";
        const pdfParser = require("pdf-parse");

        // pdf-parse v1 is the locked production dependency. The fallback also
        // keeps this endpoint compatible if a deployment happens to resolve v2.
        if (typeof pdfParser === "function") {
            const parsed = await pdfParser(req.file.buffer);
            resumeText = String(parsed?.text || "").replace(/\s+/g, " ").trim();
        } else {
            const { PDFParse } = pdfParser;
            const parser = new PDFParse({ data: req.file.buffer });
            try {
                const parsed = await parser.getText();
                resumeText = String(parsed?.text || "").replace(/\s+/g, " ").trim();
            } finally {
                await parser.destroy();
            }
        }

        if (resumeText.length < 80) {
            return res.status(422).json({
                success: false,
                message: "The PDF was uploaded, but too little readable text was extracted. Please use a text-based/selectable-text PDF rather than a scanned image PDF."
            });
        }

        const result = await intelligenceService.analyzeResume(resumeText, req.body.targetRole);
        return res.status(200).json({
            ...result,
            resume: {
                fileName: req.file.originalname,
                extractedCharacters: resumeText.length
            }
        });
    } catch (error) {
        console.error("[Resume PDF]", error);
        error.statusCode = error.statusCode || 422;
        next(error);
    }
};

const getRecommendations = async (req, res, next) => {
    try {
        const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);
        const currentUser = await User.findById(req.user.userId).select("skills");
        if (!currentUser) return res.status(404).json({ success: false, message: "User not found." });
        const users = await User.find({ _id: { $ne: req.user.userId } }).select("name bio skills github linkedin location profilePicture").lean();
        const result = await intelligenceService.getRecommendations(currentUser.skills || [], users, limit);
        return res.status(200).json(result);
    } catch (error) { next(error); }
};

const algorithmDemo = async (req, res, next) => {
    try { return res.status(200).json(await intelligenceService.runAlgorithmDemo(req.body)); }
    catch (error) { next(error); }
};

module.exports = { health, analyzeResume, analyzeResumePdf, getRecommendations, algorithmDemo };
