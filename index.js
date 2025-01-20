import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import { connectDb } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import followRoutes from "./src/routes/followRoutes.js";
import likeRoutes from "./src/routes/likeRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";

import cors from "cors";
import { authenticateSocket } from "./src/middlewares/authSocket.js";
import { notificationSocketHandler } from "./src/routes/notificationsRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Укажите разрешенный домен
    methods: ["GET", "POST", "PUT", "DELETE"], // Укажите разрешенные методы
    allowedHeaders: ["Content-Type", "Authorization"], // Укажите разрешенные заголовки
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/search", searchRoutes);

io.use((socket, next) => {
  authenticateSocket(socket, next);
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("notification", (data) => {
    console.log("Notification received:", data);
  });

  notificationSocketHandler(socket, io);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.set("io", io);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
