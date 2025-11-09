import { pool } from "../Db/connection.js";
import { v4 as uuidv4 } from "uuid";
const saveNotification = async (type, targetId, message, title) => {
  try {
    const id = uuidv4();
    if (type === "user") {
      await pool.query(
        `Insert into ThongBao (id,userId,title,message,createAt) VALUES (?,?,?,?,NOW())`,
        [id, targetId, title, message]
      );
    }

    if (type === "class") {
      await pool.query(
        `INSERT INTO ThongBao (id,MaLop,title,message,createAt) VALUES (?,?,?,?,NOW())`,
        [id, targetId, title, message]
      );
    }

    return {id}
  } catch (err) {
    throw err;
  }
};

export const NotificationService = {
  saveNotification,
};
