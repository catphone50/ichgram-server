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

// socket.on("loadMessages", () => {
//   console.log("loadMessages");
// });

export const sendMessage = async (userId, targetUserId, roomId, message) => {
  try {
    const newMessage = new Message({
      sender_id: userId,
      receiver_id: targetUserId,
      text: message,
    });

    await newMessage.save();

    io.to(roomId).emit("receiveMessage", newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
  }
};
