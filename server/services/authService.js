const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendVerificationCode } = require("./emailService");

const createToken = (user) => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
    return jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const createCode = () => String(crypto.randomInt(100000, 1000000));
const verificationExpiry = () => new Date(Date.now() + 15 * 60 * 1000);

const signup = async (userData) => {
    const name = String(userData.name || "").trim();
    const email = String(userData.email || "").trim().toLowerCase();
    const password = String(userData.password || "");
    const existing = await User.findOne({ email });
    if (existing) {
        const error = new Error(existing.emailVerified ? "Email already registered" : "Email already registered but not verified. Please resend verification.");
        error.statusCode = 409;
        throw error;
    }

    const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 12),
        emailVerified: false,
        emailVerificationCode: createCode(),
        emailVerificationExpires: verificationExpiry()
    });

    try {
        await sendVerificationCode(user.email, user.name, user.emailVerificationCode);
    } catch (error) {
        await User.findByIdAndDelete(user._id);
        error.statusCode = 503;
        throw error;
    }

    return { _id: user._id, name: user.name, email: user.email, emailVerified: false, createdAt: user.createdAt, updatedAt: user.updatedAt };
};

const verifyEmail = async (email, code) => {
    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });
    if (!user) { const error = new Error("Account not found."); error.statusCode = 404; throw error; }
    if (user.emailVerified) return { message: "Email already verified." };
    if (!user.emailVerificationExpires || user.emailVerificationExpires.getTime() < Date.now()) { const error = new Error("Verification code expired. Please request a new code."); error.statusCode = 400; throw error; }
    if (String(code || "").trim() !== user.emailVerificationCode) { const error = new Error("Invalid verification code."); error.statusCode = 400; throw error; }
    user.emailVerified = true;
    user.emailVerificationCode = "";
    user.emailVerificationExpires = null;
    await user.save();
    return { message: "Email verified successfully. You can now log in." };
};

const resendVerification = async (email) => {
    const user = await User.findOne({ email: String(email || "").trim().toLowerCase() });
    if (!user) { const error = new Error("Account not found."); error.statusCode = 404; throw error; }
    if (user.emailVerified) return { message: "Email is already verified." };
    user.emailVerificationCode = createCode();
    user.emailVerificationExpires = verificationExpiry();
    await user.save();
    await sendVerificationCode(user.email, user.name, user.emailVerificationCode);
    return { message: "A new verification code was sent to your email." };
};

const login = async (loginData) => {
    const email = String(loginData.email || "").trim().toLowerCase();
    const password = String(loginData.password || "");
    const user = await User.findOne({ email });
    if (!user) { const error = new Error("Invalid email or password"); error.statusCode = 401; throw error; }
    if (user.emailVerified === false && user.emailVerificationCode) { const error = new Error("Please verify your email address before logging in."); error.statusCode = 403; throw error; }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { const error = new Error("Invalid email or password"); error.statusCode = 401; throw error; }
    return { token: createToken(user), user: { id: user._id, name: user.name, email: user.email, emailVerified: user.emailVerified !== false } };
};

module.exports = { signup, login, verifyEmail, resendVerification };
