import {
  getNotifications,
  createNotification,
} from "../controllers/notificationController.js";

export const notificationSocketHandler = (socket, io) => {
  socket.on("joinNotifications", () => {
    const userId = socket.user._id;

    console.log(`User ${userId} joined notifications socket`);
    socket.join(`notifications_${userId}`);
    getNotifications(userId).then((notifications) => {
      socket.emit("initialNotifications", notifications);
    });
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected. Connection ID:", socket.id);
  });
};
