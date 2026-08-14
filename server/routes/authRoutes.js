const express = require("express");
const router = express.Router();
const { signup, login, verifyEmail, resendVerification } = require("../controllers/authController");
const { signupValidation, validate } = require("../validations/authValidation");

router.post("/signup", signupValidation, validate, signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

module.exports = router;
