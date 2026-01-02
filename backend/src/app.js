import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authController from "./controllers/authController.js";

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// --- ROUTES ---
app.use("/api/auth", authController);

// --- HEALTH CHECK ---
app.get("/", (req, res) => {
    res.send("MediCare+ API is running...");
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

export default app;
