import { pool } from "../Db/connection.js";

const getSchedule = async (msgv, from, to) => {
  try {
    const [teacher] = await pool.query("select * from GiangVien where MSGV = ?",[msgv])

    if (teacher.length === 0){
      return []
    }

    let sql = `
        select ld.MaLichDay , ld.ngay_day, ld.tiet_batdau ,ld.tiet_kethuc ,ld.phonghoc ,
        gv.hoten as giangvien, mh.ten_mon , lh.ten_lop 
        from LichDay ld
        join GiangVien gv on ld.MSGV = gv.MSGV 
        join MonHoc mh on ld.MaMH = mh.MaMH 
        join LopHoc lh on ld.MaLop = lh.MaLop
        where 1=1`;
    const params =[]
    if (msgv){
        sql += " and ld.MSGV = ?"
        params.push(msgv)
    }
    if (from && to){
        sql += " and ld.ngay_day BETWEEN ? and ?"
        params.push(from,to)
    }

    const [rows] = await pool.query(sql,params)

    return rows
  } catch (err) {
    throw err;
  }
};

export const ScheduleTeacherService = {
    getSchedule
}