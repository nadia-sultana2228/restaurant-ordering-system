import express from "express";
import cors from "cors"; // Allows API requests from frontend
import dotenv from "dotenv"; // Loads environment variables
import connectDB from "./config/database.js"; // Import database connection

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json()); // Parses JSON data
app.use(cors()); // Enables CORS (important for frontend)

connectDB(); // Connect to MongoDB

app.get("/", (req, res) => {
    res.send("✅ API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
