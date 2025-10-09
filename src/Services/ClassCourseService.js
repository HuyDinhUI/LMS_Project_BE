import { pool } from "../Db/connection.js";
import { createMaLichDay, CreateMaLop } from "../Utils/create_id.js";

const getAllClassCourse = async (
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

    let query =
      "FROM LopHoc WHERE 1=1";
    let params = [];

    if (keyword) {
      query += " AND (ten_lop LIKE ? OR MaLop LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const validSort = ["MaLop", "ten_lop", "si_so"];
    const sortCol = validSort.includes(sortBy) ? sortBy : "MaLop";
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

const createClassCourse = async (data) => {
  const {
    ten_lop,
    MaHK,
    phonghoc,
    si_so,
    MaHP,
    MSGV,
    ThuTrongTuan,
    ngay_batdau,
    ngay_kethuc,
    tiet_batdau,
    tiet_kethuc,
    TrangThai,
  } = data;

  try {
    const MaLop = CreateMaLop(MaHP);

    if (tiet_batdau > tiet_kethuc) {
      throw Error("Tiết bắt đầu phải nhỏ hơn tiết kết thúc");
    }

    // Tạo lớp học phần
    const [classCourse] = await pool.query(
      "INSERT INTO LopHoc (MaLop, ten_lop, MaHK, phonghoc, si_so, MaHP, MSGV) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [MaLop, ten_lop, MaHK, phonghoc, si_so, MaHP, MSGV]
    );

    // Lặp lịch
    let current = new Date(ngay_batdau);
    const end = new Date(ngay_kethuc);
    let MaLichDay = ''
    let ngay_day = ''

    while (current <= end) {
      if (current.getDay() === parseInt(ThuTrongTuan)) {
        MaLichDay = createMaLichDay(MaLop);
        ngay_day = current.toISOString().split("T")[0]

        const [scheludes] = await pool.query(
          "INSERT INTO LichDay (MaLichDay, MaLop, ngay_day, ngay_batdau, ngay_kethuc, tiet_batdau, tiet_kethuc, TrangThai, ThuTrongTuan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            MaLichDay,
            MaLop,
            ngay_day,
            ngay_batdau,
            ngay_kethuc,
            tiet_batdau,
            tiet_kethuc,
            TrangThai,
            ThuTrongTuan,
          ]
        );
      }

      current.setDate(current.getDate() + 1)
    }

    return {
      MaLop,
      MaLichDay,
      MaHK,
      phonghoc,
      si_so,
      MaHP,
      MSGV,
      ngay_day,
      ngay_batdau,
      ngay_kethuc,
      tiet_batdau,
      tiet_kethuc,
      TrangThai,
      ThuTrongTuan
    };
  } catch (err) {
    throw err;
  }
};

const updateClassCourse = async (data) => {
  const {
    MaLop,
    ten_lop,
    MaHK,
    phonghoc,
    si_so,
    MaHP,
    MSGV,
  } = data;

  try {
    // if (tiet_batdau > tiet_kethuc) {
    //   throw Error("Tiết bắt đầu phải nhỏ hơn tiết kết thúc");
    // }

    // Cập nhật lớp học phần
    await pool.query(
      "Update LopHoc set ten_lop = ?, MaHK = ?, phonghoc = ?, si_so = ?, MaHP = ?, MSGV = ? where MaLop = ?",
      [ten_lop, MaHK, phonghoc, si_so, MaHP, MSGV, MaLop]
    );
    // Cập nhật lịch dạy
    // await pool.query(
    //   "Update LichDay set MaLop = ?, ngay_day = ?, tiet_batdau = ?, tiet_kethuc = ? where MaLichDay = ?",
    //   [MaLop, ngay_day, tiet_batdau, tiet_kethuc, MaLichDay]
    // );

    return {
      MaLop,
      ten_lop,
      MaHK,
      phonghoc,
      si_so,
      MaHP,
      MSGV,
    };
  } catch (err) {
    throw err;
  }
};

const deleteClassCourse = async (MaLop) => {
  try {
    // Xoá lịch trước
    await pool.query("delete from LichDay where MaLop = ?", [MaLop]);
    // Xoá lớp học phần
    await pool.query("delete from LopHoc where MaLop = ?", [MaLop]);

    return { MaLop };
  } catch (err) {
    throw err;
  }
};

const getOneClassCourse = async (Malop) => {
  try {
    const [classCourse] = await pool.query(
      "select lh.MaLop, lh.ten_lop , lh.MaHK , lh.phonghoc , lh.si_so , lh.MSGV, lh.MaHP  from LopHoc lh where lh.MaLop = ?",
      [Malop]
    );

    return { data: classCourse };
  } catch (err) {
    throw err;
  }
};

const getClassCourseByTeacher = async (msgv) => {
  try{ 
    const [classCourse] = await pool.query(
      "select * from LopHoc where MSGV = ?"
      ,[msgv]
    )

    return {data: classCourse}
  }
  catch(err){
    throw err
  }
}

const getClassCourseByStudent = async (masv) => {
  const [classCourse] = await pool.query(
    `select lh.MaLop , lh.ten_lop , lh.si_so , lh.MaHP 
    from LopHoc lh
    join DangKyHocPhan dkhp on lh.MaLop = dkhp.MaLop 
    where dkhp.MaSV  = ?
    group by lh.MaLop`,[masv]
  )

  return {data: classCourse}
}

export const ClassCourseService = {
  getAllClassCourse,
  createClassCourse,
  updateClassCourse,
  deleteClassCourse,
  getOneClassCourse,
  getClassCourseByTeacher,
  getClassCourseByStudent
};
