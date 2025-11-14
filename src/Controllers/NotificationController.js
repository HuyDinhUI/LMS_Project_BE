import { NotificationService } from "../Services/NotificationService.js";

const sendNotification = async (req, res) => {
  const { type, targetId, message, title } = req.body;
  const io = req.app.get("io");
  // Gửi realtime
  if (type === "user")
    io.to(`user_${targetId}`).emit("receive_notification", { message, title, create_at: new Date() });
  if (type === "class")
    io.to(`class_${targetId}`).emit("receive_notification", { message, title, create_at: new Date() });

  // TODO: lưu vào DB (Notification table)
  try{
    const result = await NotificationService.saveNotification(type, targetId, message, title)
    res.status(200).json({message: 'Lưu tin nhắn thành công', result})
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
  
};


export const NotificationController = {
    sendNotification
}
