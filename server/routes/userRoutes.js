const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");


const {

    getProfile,

    getPublicProfile,

    updateProfile,

    uploadProfilePicture,

    toggleBookmark,

    getBookmarks,

    toggleFollow,

    getConnections

} = require("../controllers/userController");


// =====================================
// PUBLIC PROFILE
// =====================================

router.get(
    "/profile/:userId",
    getPublicProfile
);


// =====================================
// MY PROFILE
// =====================================

router.get(
    "/profile",
    authMiddleware,
    getProfile
);


// =====================================
// UPDATE MY PROFILE
// =====================================

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// =====================================
// UPLOAD PROFILE PICTURE
// =====================================

router.post(
    "/upload-profile-picture",
    authMiddleware,
    upload.single(
        "profilePicture"
    ),
    uploadProfilePicture
);


// =====================================
// BOOKMARK
// =====================================

router.put(
    "/bookmark/:projectId",
    authMiddleware,
    toggleBookmark
);


// =====================================
// GET BOOKMARKS
// =====================================

router.get(
    "/bookmarks",
    authMiddleware,
    getBookmarks
);


// =====================================
// FOLLOW / UNFOLLOW
// =====================================

router.put(
    "/follow/:userId",
    authMiddleware,
    toggleFollow
);


// =====================================
// CONNECTIONS
// =====================================

router.get(
    "/connections/:userId",
    getConnections
);


module.exports = router;