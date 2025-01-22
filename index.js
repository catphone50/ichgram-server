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
import notificationsRoutes from "./src/routes/notificationsRoutes.js";

import cors from "cors";
import { authenticateSocket } from "./src/middlewares/authSocket.js";
import { getNotifications } from "./src/controllers/notificationController.js";
import Notification from "./src/models/notificationModel.js";

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
app.use("/api/notifications", notificationsRoutes);

io.use((socket, next) => {
  authenticateSocket(socket, next);
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("joinNotifications", async () => {
    try {
      if (!socket.user || !socket.user._id) {
        console.error("Unauthorized socket connection");
        return socket.disconnect(true);
      }
      const userId = socket.user._id;
      socket.join(`notifications_${userId}`);
      const notifications = await getNotifications(userId.toString());
      socket.emit("initialNotifications", notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      socket.emit("error", { message: "Unable to fetch notifications." });
    }
  });

  socket.on("markAsRead", async () => {
    try {
      if (!socket.user || !socket.user._id) {
        console.error("Unauthorized socket connection");
        return socket.disconnect(true);
      }
      const userId = socket.user._id;
      await Notification.updateMany(
        { recipient: userId, read: false },
        { $set: { read: true } }
      );
      socket.emit("notificationsMarkedAsRead", {
        message: "Уведомления успешно обновлены",
      });
    } catch (error) {
      console.error("Ошибка при обновлении статуса уведомлений", error);
      socket.emit("error", {
        message: "Ошибка при обновлении статуса уведомлений",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected. Connection ID:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.set("io", io);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
