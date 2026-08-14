const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { health, analyzeResume, analyzeResumePdf, getRecommendations, algorithmDemo } = require("../controllers/intelligenceController");

router.get("/health", health);
router.post("/resume/analyze", authMiddleware, analyzeResume);
router.post("/resume/analyze-pdf", authMiddleware, upload.single("resume"), analyzeResumePdf);
router.get("/recommendations", authMiddleware, getRecommendations);
router.post("/algorithms/demo", authMiddleware, algorithmDemo);

module.exports = router;
