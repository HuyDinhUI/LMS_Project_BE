import { userSockets } from "./index.js";

/**
 * Xử lý các sự kiện socket liên quan đến thông báo.
 * @param {Server} io - instance socket.io
 * @param {Socket} socket - socket của người dùng hiện tại
 */
export const registerNotificationHandlers = (io, socket) => {
  // Khi admin hoặc hệ thống gửi thông báo đến 1 lớp
  socket.on("send_class_notification", ({ classId, message }) => {
    if (!classId || !message) return;
    io.to(`class_${classId}`).emit("receive_notification", {
      target: "class",
      classId,
      message,
      timestamp: new Date(),
    });
    console.log(`📢 Gửi thông báo đến lớp ${classId}:`, message);
  });

  // Khi gửi thông báo đến 1 cá nhân
  socket.on("send_user_notification", ({ userId, message }) => {
    const socketId = userSockets.get(userId);
    if (socketId) {
      io.to(socketId).emit("receive_notification", {
        target: "user",
        userId,
        message,
        timestamp: new Date(),
      });
      console.log(`📩 Gửi thông báo đến user ${userId}:`, message);
    } else {
      console.log(`⚠️ User ${userId} không online`);
    }
  });
};
