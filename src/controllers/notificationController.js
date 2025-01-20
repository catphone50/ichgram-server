import Notification from "../models/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Ошибка при получении уведомлений", error });
  }
};

export const createNotification = async (io, userId, message, type) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
    });

    await notification.save();

    io.to(`notifications_${userId}`).emit("receiveNotification", {
      user: userId,
      message,
      type,
      createdAt: notification.createdAt,
    });
  } catch (error) {
    console.error("Ошибка при создании уведомления", error);
  }
};

export const deleteNotification = async (userId, message, type) => {
  try {
    await Notification.findOneAndDelete({
      user: userId,
      message,
      type,
    });
  } catch (error) {
    console.error("Ошибка при удалении уведомления", error);
  }
};
