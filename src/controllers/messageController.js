import Message from "../models/messageModel.js";

export const loadMessages = async (userId, targetUserId, socket) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: targetUserId },
        { sender_id: targetUserId, receiver_id: userId },
      ],
    }).sort({ createdAt: 1 });
    socket.emit("loadMessages", messages);
  } catch (err) {
    console.error("Error loading messages:", err);
    socket.emit("error", { error: "Error loading messages" });
  }
};

export const sendMessage = async (
  userId,
  targetUserId,
  roomId,
  message,
  io
) => {
  try {
    const newMessage = new Message({
      sender_id: userId,
      receiver_id: targetUserId,
      text: message,
      isRead: false,
    });

    await newMessage.save();

    io.to(roomId).emit("receiveMessage", newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

export const countUnreadMessages = async (userId, targetUserId, socket) => {
  try {
    const unreadMessagesCount = await Message.countDocuments({
      sender_id: targetUserId,
      receiver_id: userId,
      isRead: false,
    });

    socket.emit("unreadMessagesCount", {
      count: unreadMessagesCount,
      targetUserId,
    });
  } catch (err) {
    console.error("Error counting unread messages:", err);
    socket.emit("error", { error: "Error counting unread messages" });
  }
};

export const countAllUnreadMessages = async (userId) => {
  try {
    const totalUnreadMessages = await Message.countDocuments({
      receiver_id: userId,
      isRead: false,
    });
    return totalUnreadMessages;
  } catch (err) {
    console.error("Ошибка при подсчёте всех непрочитанных сообщений:", err);
    throw err;
  }
};
