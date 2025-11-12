import { pool } from "../Db/connection.js";
import { CreateMaSV } from "../Utils/create_id.js";

const getAllStudent = async (
  keyword,
  gioitinh,
  sortBy = "MaSV",
  order = "asc",
  page = 1,
  limit = 10
) => {
  try {
    // Parse page và limit sang số nguyên
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = "FROM SinhVien WHERE 1=1";
    let params = [];

    if (keyword) {
      query += " AND (hoten LIKE ? OR email LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (gioitinh) {
      query += " AND gioitinh = ?";
      params.push(gioitinh);
    }

    const validSort = ["MaSV", "hoten"];
    const sortCol = validSort.includes(sortBy) ? sortBy : "MaSV";
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

const getOneStudent = async (masv) => {
  try {
    const [student] = await pool.query(
      "select *, k.ten_khoa,n.ten_nganh from SinhVien s join Khoa k on s.MaKhoa = k.MaKhoa join ChuyenNganh n on s.MaNganh = n.MaNganh where s.MaSV = ?",
      [masv]
    );

    if (student.length === 0) {
      throw Error("Sinh viên không tồn tại");
    }

    return { data: student };
  } catch (err) {
    throw err;
  }
};

const createStudent = async (data) => {
  const { hoten, email, sdt, ngaysinh, gioitinh, MaLopHC, MaKhoa, MaNganh } =
    data;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const MaSV = CreateMaSV(MaKhoa);

    const [mailExist] = await connection.query(
      "select * from SinhVien where email = ?",
      [email]
    );

    if (mailExist.length > 0) {
      throw Error("Email đã tồn tại");
    }

    await connection.query(
      "Insert into SinhVien (MaSV,hoten,email,sdt,ngaysinh,gioitinh,MaLopHC,MaKhoa,MaNganh) VALUES (?,?,?,?,?,?,?,?,?)",
      [MaSV, hoten, email, sdt, ngaysinh, gioitinh, MaLopHC, MaKhoa, MaNganh]
    );

    const password = ngaysinh.replaceAll("-", "");

    await connection.query(
      "Insert into Account_list (username,password,role,fullname) VALUES (?,?,?,?)",
      [MaSV, password, "SV", hoten]
    );

    await connection.commit();

    return {
      MaSV,
      hoten,
      email,
      sdt,
      ngaysinh,
      gioitinh,
      MaLopHC,
      MaKhoa,
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const updateStudent = async (data) => {
  const { MaSV, hoten, email, sdt, ngaysinh, gioitinh, MaLopHC, MaKhoa } = data;

  try {
    const [student] = await pool.query(
      "Update SinhVien set hoten = ?, email = ?, sdt = ?, ngaysinh = ?, gioitinh = ?, MaLopHC = ?, MaKhoa = ? where MaSV = ?",
      [hoten, email, sdt, ngaysinh, gioitinh, MaLopHC, MaKhoa, MaSV]
    );

    return {
      MaSV,
      hoten,
      email,
      sdt,
      ngaysinh,
      gioitinh,
      MaLopHC,
      MaKhoa,
    };
  } catch (err) {
    throw err;
  }
};

const deleteStudent = async () => {};

const getSchedule = async (masv) => {
  try {
    const [schedule] = await pool.query(
      `select ld.MaLichDay , 
      MAX(ld.MaLop) AS MaLop,
      MAX(ld.ngay_day) AS ngay_day, 
      MAX(ld.tiet_batdau) AS tiet_batdau, 
      MAX(ld.tiet_kethuc) AS tiet_kethuc ,
      MAX(ld.TrangThai) AS TrangThai , 
      MAX(lh.ten_lop) AS ten_lop,
      MAX(gv.hoten) AS hoten,
      MAX(lh.phonghoc) AS phonghoc
      from LichDay ld 
      join DangKyHocPhan dkhp on ld.MaLop = dkhp.MaLop 
      join LopHoc lh on ld.MaLop  = lh.MaLop 
      join GiangVien gv on lh.MSGV = gv.MSGV 
      where dkhp.MaSV = ?
      group by ld.MaLichDay`,
      [masv]
    );

    return { data: schedule };
  } catch (err) {
    throw err;
  }
};

export const StudentService = {
  getAllStudent,
  getOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getSchedule,
};
