import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "./db/index.js";
import docRoutes from "./routes/docRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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
