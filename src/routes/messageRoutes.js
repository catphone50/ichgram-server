import { sendMessage, loadMessages } from "../controllers/messageController.js";

export const messageSocketHandler = (socket, io) => {
  socket.on("joinRoom", ({ targetUserId }) => {
    const userId = socket.user._id;
    const roomId = [userId, targetUserId].sort().join("_");
    socket.join(roomId);

    loadMessages(userId, targetUserId, roomId);
  });
  socket.on("sendMessage", (data) => {
    const userId = socket.user._id;
    const targetUserId = data.targetUserId;
    const roomId = [userId, targetUserId].sort().join("_");
    sendMessage(userId, targetUserId, roomId, data.message);
  });

  socket.on("disconnect", () => {
    console.log("User was disconnected. Connection ID:", socket.id);
  });
};
