import { Server } from "socket.io";
import { registerNotificationHandlers } from "./notification.socket.js";

const userSockets = new Map(); // lưu userId -> socketId

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Khi client join
    socket.on("join_room", ({ userId, classIds = [] }) => {
      if (userId) {
        userSockets.set(userId, socket.id);
        socket.join(`user_${userId}`);
      }
      if (Array.isArray(classIds) && classIds.length > 0) {
        classIds.forEach((classId) => {
          socket.join(`class_${classId}`);
        });
        console.log(`📚 User ${userId} joined classes:`, classIds);
      } else if (typeof classIds === "string") {
        socket.join(`class_${classIds}`);
        console.log(`📚 User ${userId} joined class: ${classIds}`);
      }

      console.log(
        `User ${userId} joined rooms: user_${userId}, class_${classIds}`
      );
    });

    // Đăng ký các event socket riêng
    registerNotificationHandlers(io, socket);

    // Khi ngắt kết nối
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      for (const [id, sId] of userSockets.entries()) {
        if (sId === socket.id) userSockets.delete(id);
      }
    });
  });

  return io;
};

export { userSockets };
