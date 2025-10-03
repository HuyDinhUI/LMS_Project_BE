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

    let query = "FROM GiangVien WHERE 1=1";
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

const getOneTeacher = async (msgv) => {
  try {
    const [user] = await pool.query("SELECT *, k.ten_khoa FROM GiangVien gv join Khoa k on gv.MaKhoa = k.MaKhoa WHERE gv.MSGV = ?", [
      msgv,
    ]);

    return { data: user };
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
    MaKhoa,
    trinhdo,
    ngaytuyendung,
    trangthai = "Đang công tác",
    loaigiangvien,
    donvicongtac,
  } = data;
  try {
    const MSGV = CreateMSGV(loaigiangvien, MaKhoa);

    //check mail
    const [mailExist] = await pool.query(
      "SELECT * FROM GiangVien WHERE email = ?",
      [email]
    );
    if (mailExist.length > 0) {
      throw Error("Email đã tồn tại");
    }

    // create user
    const [user] = await pool.query(
      "INSERT INTO GiangVien (MSGV, hoten, ngaysinh, sdt, diachi, email, gioitinh, MaKhoa, trinhdo, ngaytuyendung, trangthai, loai_giangvien, don_vi_cong_tac) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        MSGV,
        hoten,
        ngaysinh,
        sdt,
        diachi,
        email,
        gioitinh,
        MaKhoa,
        trinhdo,
        ngaytuyendung,
        trangthai,
        loaigiangvien,
        donvicongtac,
      ]
    );

    // create account
    const password = ngaysinh.replaceAll("-", "");
    const [account] = await pool.query(
      "INSERT INTO Account_List (password,role,username) VALUES (?,?,?)",
      [password, "GV", MSGV]
    );

    return { id: user.insertId, user };
  } catch (err) {
    throw err;
  }
};

const deleteTeacher = async (msgv) => {
  try {
    const [account] = await pool.query(
      "DELETE FROM Account_List WHERE username = ?",
      [msgv]
    );
    const [user] = await pool.query("DELETE FROM GiangVien WHERE MSGV = ?", [
      msgv,
    ]);

    return { user, account };
  } catch (err) {
    throw err;
  }
};

const updateTeacher = async (data) => {
  const {
    MSGV,
    hoten,
    ngaysinh,
    sdt,
    diachi,
    email,
    gioitinh,
    MaKhoa,
    trinhdo,
    ngaytuyendung,
    trangthai = "Đang công tác",
    loai_giangvien,
    don_vi_cong_tac,
  } = data;
  try {
    const [result] = await pool.query(
      "UPDATE GiangVien SET hoten = ?, ngaysinh = ?, sdt = ?, diachi = ?, email = ?, gioitinh = ?, MaKhoa = ?, trinhdo = ?, ngaytuyendung = ?, trangthai = ?, loai_giangvien = ?, don_vi_cong_tac = ? WHERE MSGV = ?",
      [
        hoten,
        ngaysinh,
        sdt,
        diachi,
        email,
        gioitinh,
        MaKhoa,
        trinhdo,
        ngaytuyendung,
        trangthai,
        loai_giangvien,
        don_vi_cong_tac,
        MSGV
      ]
    );

    return {message: 'Update thành công'}
  } catch (err) {
    throw err;
  }
};

const getSchedule = async (msgv) => {
  try{
    const [schedule] = await pool.query(`
      select lh.MaLop, lh.ten_lop , lh.MaHK , lh.phonghoc , lh.si_so ,ld.ngay_day , ld.tiet_batdau ,ld.tiet_kethuc, gv.hoten, gv.MSGV, ld.MaLichDay, ld.TrangThai  
      from LopHoc lh 
      join LichDay ld on lh.MaLop = ld.MaLop
      join GiangVien gv on gv.MSGV = lh.MSGV
      where lh.MSGV   = ?
      group by ld.MaLop, ld.ngay_day , ld.tiet_batdau , ld.tiet_kethuc, ld.MaLichDay, ld.TrangThai
      `,[msgv])



      return {data: schedule}
  }

  
  catch(err){
    throw err
  }
}

export const TeacherService = {
  getAllTeacher,
  createTeacher,
  deleteTeacher,
  getOneTeacher,
  updateTeacher,
  getSchedule
};
