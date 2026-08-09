const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.sign(
        {
            userId: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

const signup = async (userData) => {
    const name = String(userData.name || "").trim();
    const email = String(userData.email || "").trim().toLowerCase();
    const password = String(userData.password || "");

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword =
        await bcrypt.hash(password, 12);

    const user =
        await User.create({
            name,
            email,
            password: hashedPassword
        });

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

const login = async (loginData) => {
    const email =
        String(loginData.email || "")
            .trim()
            .toLowerCase();

    const password =
        String(loginData.password || "");

    const user =
        await User.findOne({ email });

    if (!user) {
        const error =
            new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        const error =
            new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    return {
        token: createToken(user),
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    };
};

module.exports = {
    signup,
    login
};
