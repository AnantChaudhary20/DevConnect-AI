const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    analyzeResume,
    getRecommendations,
    algorithmDemo
} = require("../controllers/intelligenceController");

router.post(
    "/resume/analyze",
    authMiddleware,
    analyzeResume
);

router.get(
    "/recommendations",
    authMiddleware,
    getRecommendations
);

router.post(
    "/algorithms/demo",
    authMiddleware,
    algorithmDemo
);

module.exports = router;
