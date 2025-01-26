import { getNotifications } from "../controllers/notificationController.js";
import Notification from "../models/notificationModel.js";

export const notificationSocketHandler = (socket, io) => {
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
};
