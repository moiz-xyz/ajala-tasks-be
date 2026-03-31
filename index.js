import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // 1. Import cors
import "dotenv/config";
import connectDB from "./db/index.js";
import docRoutes from "./routes/docRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/documents", docRoutes);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
