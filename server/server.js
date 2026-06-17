import express from "express";
import cors from "cors";
import "dotenv/config";
import {
  clerkMiddleware,
  requireAuth,
} from "@clerk/express";

import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// Connect Cloudinary
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Public Route
app.get("/", (req, res) => {
  res.send("Server is Live!");
});

// Protected Routes
app.use("/api/ai", requireAuth(), aiRouter);

app.use("/api/user", requireAuth(), userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});