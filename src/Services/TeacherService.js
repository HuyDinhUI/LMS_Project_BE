import { pool } from "../Db/connection.js";
import { CreateMSGV } from "../Utils/create_id.js";

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
      totalPages: Math.ceil(total / limitNum),
      data: rows,
    };
  } catch (err) {
    throw err;
  }
};

const createTeacher = async (data) => {
  const {
    hoten,
    ngaysinh,
    sdt,
    diachi,
    email,
    gioitinh,
    chucdanh,
    trinhdo,
    khoa,
    hinhanh,
    role
  } = data;
  try {
    const MSGV = CreateMSGV(role)
    // create user
    const [user] = await pool.query(
      "INSERT INTO Teacher (MSGV, hoten, ngaysinh, sdt, diachi, email, gioitinh, chucdanh, trinhdo, khoa, hinhanh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        MSGV,
        hoten,
        ngaysinh,
        sdt,
        diachi,
        email,
        gioitinh,
        chucdanh,
        trinhdo,
        khoa,
        hinhanh,
      ]
    );

    // create account
    const password = ngaysinh.replaceAll('-','')
    const [account] = await pool.query(
      "INSERT INTO Account_List (password,role,username) VALUES (?,?,?)",[password,role,MSGV]
    )

    return {id: user.insertId,user};
  } catch (err) {
    throw err;
  }
};

export const TeacherService = {
  getAllTeacher,
  createTeacher,
};
