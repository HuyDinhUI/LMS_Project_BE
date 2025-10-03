import { pool } from "../Db/connection.js";

const getSchedule = async (
  keyword,
  sortBy = "MaLichDay",
  order = "asc",
  page = 1,
  limit = 10
) => {
  try {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = `from LichDay ld join LopHoc lh on ld.MaLop = lh.MaLop 
        join GiangVien gv on lh.MSGV = gv.MSGV 
        join HocPhan hp on lh.MaHP  = hp.MaHP WHERE 1=1`;
    let params = [];

    if (keyword) {
      query += " AND (MaLichDay LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const validSort = ["MaLichDay", "ngay_day", "tiet_batdau", "tiet_kethuc"];
    const sortCol = validSort.includes(sortBy) ? sortBy : "MaLichDay";
    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Đếm tổng số bản ghi
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total ${query}`,
      params
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      `select ld.MaLichDay , ld.ngay_day, ld.tiet_batdau ,ld.tiet_kethuc ,lh.phonghoc ,gv.MSGV as giangvien, hp.ten_hocphan , lh.ten_lop, lh.MaLop ${query} ORDER BY ${sortCol} ${sortOrder} LIMIT ? OFFSET ?`,
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

const getScheduleById = async (malich) => {
  try{
    const [schedule] = await pool.query('select * from LichDay where MaLichDay = ?',[malich])

    if (schedule.length === 0){
      throw Error('Lịch không tồn tại')
    }

    return {data: schedule}
  }
  catch(err){
    throw err
  }
}

const updateSchedule = async (data) => {
  const {MaLichDay, ngay_day, ngay_batdau, ngay_kethuc, ThuTrongTuan, tiet_batdau, tiet_kethuc, TrangThai} = data
   
  try{
    await pool.query(
      "update LichDay set ngay_day = ?, ngay_batdau = ?, ngay_kethuc = ?, ThuTrongTuan = ?, tiet_batdau = ?, tiet_kethuc = ?, TrangThai = ? where MaLichDay = ?"
      ,[ngay_day, ngay_batdau, ngay_kethuc, ThuTrongTuan, tiet_batdau, tiet_kethuc, TrangThai, MaLichDay]
    )
     return {
      MaLichDay,
      ngay_day,
      ngay_batdau,
      ngay_kethuc,
      ThuTrongTuan,
      tiet_batdau,
      tiet_kethuc,
      TrangThai
     }

  }
  catch(err){
    throw err
  }
}

export const ScheduleTeacherService = {
  getSchedule,
  getScheduleById,
  updateSchedule
};
