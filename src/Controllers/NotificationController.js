const sendNotification = async (req, res) => {
  const { type, targetId, message } = req.body;
  const io = req.app.get("io");
  // Gửi realtime
  if (type === "user")
    io.to(`user_${targetId}`).emit("receive_notification", { message });
  if (type === "class")
    io.to(`class_${targetId}`).emit("receive_notification", { message });

  // TODO: lưu vào DB (Notification table)
  res.json({ success: true, message: "Notification sent successfully" });
};


export const NotificationController = {
    sendNotification
}
