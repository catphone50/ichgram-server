import express from "express";
import http from "http";
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
import { initializeSockets } from "./src/sockets/index.js";

const app = express();
const server = http.createServer(app);

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

const io = initializeSockets(server);
io.use((socket, next) => {
  authenticateSocket(socket, next);
});

app.set("io", io);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
