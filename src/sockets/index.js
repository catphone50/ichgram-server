import { Server } from "socket.io";
import { messageSocketHandler } from "./messageSocketHandler.js";
import { notificationSocketHandler } from "./notificationSocketHandler.js";

export const initializeSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
    messageSocketHandler(socket, io);
    notificationSocketHandler(socket, io);

    socket.on("disconnect", () => {
      console.log("User was disconnected. Connection ID:", socket.id);
    });
  });

  return io;
};
