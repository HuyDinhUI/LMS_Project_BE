import { pool } from "../Db/connection.js";

const getAllTeacher = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM Teacher");
    return rows;
  } catch (err) {
    throw err;
  }
};

export const TeacherService = {
    getAllTeacher
}
