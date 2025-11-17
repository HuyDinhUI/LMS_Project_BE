import { pool } from "../Db/connection.js";
import bcrybt, { hash } from "bcryptjs";

const getAllAccount = async (
  keyword,
  status,
  role,
  sortBy = "username",
  order = "asc",
  page = 1,
  limit = 10
) => {
  try {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = "FROM Account_List WHERE 1=1";
    let params = [];

    if (keyword) {
      query += " AND (username LIKE ? OR fullname LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }

    if (role) {
      query += " AND role = ?";
      params.push(role);
    }

    const validSort = ["username", "fullname"];
    const sortCol = validSort.includes(sortBy) ? sortBy : "username";
    const sortOrder = order.toLocaleLowerCase() === "desc" ? "DESC" : "ASC";

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
      totalPages: Math.ceil(total / limitNum),
      data: rows,
    };
  } catch (err) {
    throw err;
  }
};

const updatePassword = async (newPassword, username) => {
  try {
    const passwordHash = bcrybt.hash(newPassword, 10)
    await pool.query(
      "Update Account_List set password = ? where username = ?"
    ,[passwordHash, username]
  );

  return {username}

  } catch (err) {
    throw err;
  }
};

export const AccountService = {
  getAllAccount,
  updatePassword
};
