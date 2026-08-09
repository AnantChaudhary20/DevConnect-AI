const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    addComment,

    getComments,

    deleteComment

} = require("../controllers/commentController");

router.post(

    "/:projectId",

    authMiddleware,

    addComment

);

router.get(

    "/:projectId",

    getComments

);

router.delete(

    "/:commentId",

    authMiddleware,

    deleteComment

);

module.exports = router;