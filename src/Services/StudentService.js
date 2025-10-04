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
    try{
        const [student] = await pool.query("select *, k.ten_khoa,n.ten_nganh from SinhVien s join Khoa k on s.MaKhoa = k.MaKhoa join ChuyenNganh n on s.MaNganh = n.MaNganh where s.MaSV = ?",[masv])

        if  (student.length === 0){
            throw Error('Sinh viên không tồn tại')
        }

        return {data: student}
    }
    catch(err){
        throw err
    }
};

const createStudent = async (data) => {
    const {hoten, email, sdt, ngaysinh, gioitinh, MaLopHC, MaKhoa} = data

    try{
        const MaSV = CreateMaSV(MaKhoa)

        const [mailExist] = await pool.query("select * from SinhVien where email = ?",[email])

        if (mailExist.length > 0){
            throw Error('Email đã tồn tại')
        }
        
        const [student] = await pool.query(
            "Insert into SinhVien (MaSV,hoten,email,sdt,ngaysinh,gioitinh,MaLopHC,MaKhoa) VALUES (?,?,?,?,?,?,?,?)"
            ,[MaSV,hoten, email, sdt, ngaysinh, gioitinh, MaLopHC, MaKhoa]
        )

        const password = ngaysinh.replaceAll("-","")
        

        const [account] = await pool.query(
            "Insert into Account_list (username,password,role) VALUES (?,?,?)"
            ,[MaSV,password,"SV"]
        )

        return {
            MaSV,
            hoten,
            email,
            sdt,
            ngaysinh,
            gioitinh,
            MaLopHC,
            MaKhoa
        }
    }
    catch(err){
        throw err
    }
};

const updateStudent = async (data) => {
    const {MaSV, hoten, email, sdt, ngaysinh, gioitinh, MaLopHC, MaKhoa} = data

    try{
        const [student] = await pool.query(
            "Update SinhVien set hoten = ?, email = ?, sdt = ?, ngaysinh = ?, gioitinh = ?, MaLopHC = ?, MaKhoa = ? where MaSV = ?"
            ,[hoten, email, sdt, ngaysinh, gioitinh, MaLopHC, MaKhoa, MaSV]
        )

        return {
            MaSV,
            hoten,
            email,
            sdt,
            ngaysinh,
            gioitinh,
            MaLopHC,
            MaKhoa
        }
    }
    catch(err){
        throw err
    }

};

const deleteStudent = async () => {
    
};

export const StudentService = {
  getAllStudent,
  getOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
