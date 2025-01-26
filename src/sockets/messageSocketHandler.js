import {
  sendMessage,
  loadMessages,
  countUnreadMessages,
  countAllUnreadMessages,
} from "../controllers/messageController.js";
import Message from "../models/messageModel.js";

export const messageSocketHandler = (socket, io) => {
  socket.on("joinRoom", async ({ targetUserId }) => {
    const userId = socket.user._id;
    const roomId = [userId, targetUserId].sort().join("_");
    socket.join(roomId);

    // Загружаем сообщения и отправляем их клиенту
    loadMessages(userId, targetUserId, socket);
  });

  socket.on("getTotalUnreadMessages", async () => {
    const userId = socket.user._id;

    try {
      const totalUnreadMessages = await countAllUnreadMessages(userId);
      socket.emit("totalUnreadMessages", { count: totalUnreadMessages });
    } catch (err) {
      socket.emit("error", {
        error: "Ошибка при подсчёте всех непрочитанных сообщений",
      });
    }
  });

  socket.on("getUnreadMessagesCount", async ({ targetUserId }) => {
    const userId = socket.user._id;
    countUnreadMessages(userId, targetUserId, socket);
  });

  socket.on("sendMessage", async (data) => {
    const userId = socket.user._id;
    const targetUserId = data.targetUserId;
    const roomId = [userId, targetUserId].sort().join("_");

    // Отправляем и сохраняем сообщение в базе данных
    await sendMessage(userId, targetUserId, roomId, data.text, io);

    io.to(`user_${data.targetUserId}`).emit("newMessage");

    // Обновляем общее количество непрочитанных сообщений для получателя
    const totalUnreadMessages = await countAllUnreadMessages(data.targetUserId);
    io.to(`user_${data.targetUserId}`).emit("totalUnreadMessages", {
      count: totalUnreadMessages,
    });
  });

  socket.on("markMessagesAsRead", async ({ senderId }) => {
    const userId = socket.user._id;

    try {
      await Message.updateMany(
        {
          sender_id: senderId,
          receiver_id: userId,
          isRead: false,
        },
        { $set: { isRead: true } }
      );

      // Обновляем общее количество непрочитанных сообщений для пользователя
      const totalUnreadMessages = await countAllUnreadMessages(userId);
      socket.emit("totalUnreadMessages", { count: totalUnreadMessages });
    } catch (error) {
      console.error("Ошибка при отметке сообщений как прочитанных:", error);
    }
  });
};
