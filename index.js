import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import connectDB from "./db/index.js";
import userRoutes from "./routes/userRoutes.js";
import docRoutes from "./routes/docRoutes.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// 1. Standard Middleware
app.use(express.json());

// 2. Routes
app.use("/api/documents", docRoutes);
app.use("/api/auth", userRoutes);

// 3. Socket.io Real-time Logic
io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  socket.on("join-document", (docId) => {
    socket.join(docId);
    console.log(`User joined doc: ${docId}`);
  });

  socket.on("send-changes", (delta, docId) => {
    // Broadcast edits to others in the same document room
    socket.to(docId).emit("receive-changes", delta);
  });

  socket.on("file-uploaded", (fileData, docId) => {
    io.to(docId).emit("new-file-available", fileData);
  });

  socket.on("disconnect", () => console.log("Socket Disconnected"));
});

// 4. Connect to MongoDB then Start Server
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Sockets are active`);
  });
});
