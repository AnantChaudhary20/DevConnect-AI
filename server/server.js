require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = Number(process.env.PORT || 3000);

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Node API running at http://localhost:${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start Node API:", error.message);
    process.exit(1);
});
