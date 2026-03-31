import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./db/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.post("/api/data", (req, res) => {
  console.log("Data received from FE:", req.body);
  res.status(200).json({
    message: "Request received successfully!",
    yourData: req.body,
  });
});

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
