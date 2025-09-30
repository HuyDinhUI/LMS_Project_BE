import { pool } from "../Db/connection.js";
import { CreateMaHP } from "../Utils/create_id.js";

const getAllCourse = async (
  keyword,
  sortBy = "MaHP",
  order = "asc",
  page = 1,
  limit = 10
) => {
  try {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = "FROM HocPhan WHERE 1=1";
    let params = [];

    if (keyword) {
      query += " AND (ten_hocphan LIKE ? OR MaHP LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const validSort = ["MaHP", "ten_hocphan"];
    const sortCol = validSort.includes(sortBy) ? sortBy : "MaHP";
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


const getOneCourse = async (MaHP) => {
  try{
    const [course] = await pool.query("select * from HocPhan where MaHP = ?",[MaHP])
    if (course.length === 0){
      throw Error('Mã học phần không tồn tại')
    }

    return {data: course}
  }
  catch (err){
    throw err
  }
}

const createCourse = async (data) => {
  const { ten_hocphan, so_tinchi, MaKhoa } = data;

  try {
    const MaHP = CreateMaHP(MaKhoa);

    //check ten_hocphan
    const [existed] = await pool.query(
      "select * from HocPhan where ten_hocphan = ?",
      [ten_hocphan]
    );
    if (existed.length > 0) {
      throw Error("Tên học phần đã tồn tại");
    }

    const [course] = await pool.query(
      "INSERT INTO HocPhan (MaHP, ten_hocphan, so_tinchi, MaKhoa) VALUES (?, ?, ?, ?)",
      [MaHP, ten_hocphan, so_tinchi, MaKhoa]
    );

    return {
      MaHP,
      ten_hocphan,
      so_tinchi,
      MaKhoa,
    };
  } catch (err) {
    throw err;
  }
};

const updateCourse = async (data) => {
  const {MaHP, ten_hocphan, so_tinchi, MaKhoa } = data;
  let newMaHP = MaHP

  try{
    //check MaKhoa
    const [isUpdateMaKhoa] = await pool.query("select * from HocPhan where MaHP = ? and MaKhoa = ?",[MaHP,MaKhoa])

    if(isUpdateMaKhoa.length === 0){
      newMaHP = CreateMaHP(MaKhoa)
    }

    const result = await pool.query("Update HocPhan set MaHP = ?, ten_hocphan = ?, so_tinchi = ?, MaKhoa = ? where MaHP = ?",[newMaHP, ten_hocphan,so_tinchi,MaKhoa,MaHP])

    return {
      newMaHP,
      ten_hocphan,
      so_tinchi,
      MaKhoa
    }

  }
  catch (err){
    throw err
  }
};

const deleteCourse = async (MaHP) => {
  try{
    // xoá lịch dạy có học phần bị xoá
    // B1. Lấy tất cả các mã lớp có học phần bị xoá
    const [scheludes] = await pool.query("select MaLop from LopHoc where MaHP = ?",[MaHP])
    // B2. Xoá tất cả các lịch học có MaLop đã lấy
    scheludes.forEach(async (s) => {
      await pool.query("delete from LichDay where MaLop = ?",[s.MaLop])
    })
    // xoá lớp học phần của sinh viên đã đăng ký

    // xoá lớp học phần trước
    await pool.query("delete from LopHoc where MaHP = ?",[MaHP])

    // xoá học phần
    await pool.query("delete from HocPhan where MaHP = ?",[MaHP])

    return {MaHP}
    
  }
  catch (err){
    throw err
  }
}



export const CourseService = {
  getAllCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getOneCourse
};
