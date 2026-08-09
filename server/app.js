const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const limiter = require("./middleware/rateLimiter");
const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const commentRoutes = require("./routes/commentRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");

const app = express();

app.disable("x-powered-by");
app.use(helmet());

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.use(limiter);

app.get("/", (req, res) => {
    res.json({
        success: true,
        service: "DevConnect AI API",
        message: "API is running.",
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "node-api",
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/intelligence", intelligenceRoutes);

app.use(errorMiddleware);

module.exports = app;
