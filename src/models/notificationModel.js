import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  //для того, кто получает уведомление
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //для того, кто совершил действие
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //объект, над которым проведено действие (например, пост или комментарий)
  target: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "targetModel",
    required: true,
  },
  //модель объекта (Post или Comment), на которую ссылается target
  targetModel: {
    type: String,
    required: true,
    enum: ["Post", "Comment", "User"],
  },
  read: { type: Boolean, default: false },
  message: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
