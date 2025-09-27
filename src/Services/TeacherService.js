import { pool } from "../Db/connection.js";

const getAllTeacher = async (
  keyword,
  gioitinh,
  sortBy = "MSGV",
  order = "asc",
  page = 1,
  limit = 10
) => {
  try {
    // Parse page và limit sang số nguyên
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = "FROM Teacher WHERE 1=1";
    let params = [];

    if (keyword) {
      query += " AND (hoten LIKE ? OR email LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (gioitinh) {
      query += " AND gioitinh = ?";
      params.push(gioitinh);
    }

    const validSort = ["MSGV", "hoten"];
    const sortCol = validSort.includes(sortBy) ? sortBy : "MSGV";
    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";
    

    // Đếm tổng số bản ghi
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total ${query}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `SELECT * ${query} ORDER BY ${sortCol} ${sortOrder} LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );
    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total/limitNum),
      data: rows
    };
  } catch (err) {
    throw err;
  }
};

export const TeacherService = {
  getAllTeacher,
};
