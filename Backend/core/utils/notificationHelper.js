import Notification from "../../modules/notifications/notification.model.js";

export const createNotification = async ({ userID, title, message, type, relatedLoan }) => {
  try {
    await Notification.create({ userID, title, message, type, relatedLoan });
  } catch (err) {
    console.error("Notification creation error:", err.message);
  }
};