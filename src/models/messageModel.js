import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
