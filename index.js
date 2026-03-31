import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";
import connectDB from "./db/index.js";
import userRoutes from "./routes/userRoutes.js";
import docRoutes from "./routes/docRoutes.js";

const app = express();
const httpServer = createServer(app);

// 1. Unified CORS Configuration
const corsOptions = {
  origin: "http://localhost:5173", // Matches your Vite/React default port
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. Socket.io with matching CORS
const io = new Server(httpServer, {
  cors: corsOptions,
});

// 3. Routes
app.use("/api/documents", docRoutes);
app.use("/api/auth", userRoutes);

app.get("/", (req, res) => res.send("Server is running"));

// 4. Socket.io logic aligned with your Frontend 'EditDoc'
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // In your EditDoc, you should emit 'join-document' with the ID on mount
  socket.on("join-document", (docId) => {
    socket.join(docId);
    console.log(`Socket ${socket.id} joined room: ${docId}`);
  });

  // Matches Frontend: socket.emit("send-changes", { docId, content })
  socket.on("send-changes", ({ docId, content }) => {
    // Broadcast to everyone in the room EXCEPT the sender
    socket.to(docId).emit("receive-changes", content);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000; // Updated to 5000 to match your previous request

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
  });
});
