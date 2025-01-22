import Notification from "../models/notificationModel.js";

export const getNotifications = async (UserId) => {
  try {
    const notifications = await Notification.find({ recipient: UserId })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "sender",
        select: "avatar",
      });
    return await notifications;
  } catch (error) {
    console.error("Ошибка при получении уведомлений", error);
  }
};

export const createNotification = async (
  io,
  recipient,
  sender,
  target,
  targetModel,
  read,
  message,
  type
) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      target,
      targetModel,
      read,
      message,
      type,
    });

    await notification.save();

    io.to(`notifications_${recipient}`).emit("receiveNotification", {
      recipient,
      sender,
      target,
      targetModel,
      read,
      message,
      type,
      createdAt: notification.createdAt,
    });
  } catch (error) {
    console.error("Ошибка при создании уведомления", error);
  }
};

export const deleteNotification = async (
  recipient,
  sender,
  target,
  targetModel,
  message,
  type
) => {
  try {
    await Notification.findOneAndDelete({
      recipient,
      sender,
      target,
      targetModel,
      message,
      type,
    });
  } catch (error) {
    console.error("Ошибка при удалении уведомления", error);
  }
};

export const markNotificationsAsRead = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Пользователь не найден" });
  }

  try {
    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Уведомления успешно обновлены" });
  } catch (error) {
    console.error("Ошибка при обновлении статуса уведомлений", error);
    res
      .status(500)
      .json({ message: "Ошибка при обновлении статуса уведомлений", error });
  }
};
