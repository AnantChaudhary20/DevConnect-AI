const express = require("express");

const router = express.Router();

const upload =
    require("../middleware/uploadMiddleware");

const authMiddleware =
    require("../middleware/authMiddleware");


const {

    createProject,

    getAllProjects,

    getProjectById,

    updateProject,

    deleteProject,

    uploadProjectImage,

    toggleLikeProject,

    getFeed

} = require("../controllers/projectController");


// =====================================
// PUBLIC ROUTES
// =====================================


router.get(
    "/",
    getAllProjects
);


// =====================================
// FEED
// =====================================
// IMPORTANT:
// This must come BEFORE /:id

router.get(
    "/feed",
    authMiddleware,
    getFeed
);


// =====================================
// PROJECT BY ID
// =====================================

router.get(
    "/:id",
    getProjectById
);


// =====================================
// CREATE PROJECT
// =====================================

router.post(
    "/",
    authMiddleware,
    createProject
);


// =====================================
// UPDATE PROJECT
// =====================================

router.put(
    "/:id",
    authMiddleware,
    updateProject
);


// =====================================
// DELETE PROJECT
// =====================================

router.delete(
    "/:id",
    authMiddleware,
    deleteProject
);


// =====================================
// UPLOAD PROJECT IMAGE
// =====================================

router.post(
    "/:id/upload-image",
    authMiddleware,
    upload.single("projectImage"),
    uploadProjectImage
);


// =====================================
// LIKE / UNLIKE PROJECT
// =====================================

router.put(
    "/:id/like",
    authMiddleware,
    toggleLikeProject
);


module.exports = router;