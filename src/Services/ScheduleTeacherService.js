import { pool } from "../Db/connection.js";

const getSchedule = async (msgv, from, to) => {
  try {
    const [teacher] = await pool.query("select * from GiangVien where MSGV = ?",[msgv])

    if (teacher.length === 0){
      return []
    }

    let sql = `
        select ld.MaLichDay , ld.ngay_day, ld.tiet_batdau ,ld.tiet_kethuc ,lh.phonghoc ,
        gv.hoten as giangvien, hp.ten_hocphan , lh.ten_lop, lh.MaLop  
        from LichDay ld
        join LopHoc lh on ld.MaLop = lh.MaLop 
        join GiangVien gv on lh.MSGV = gv.MSGV 
        join HocPhan hp on lh.MaHP  = hp.MaHP 
        where 1=1`;
    const params =[]
    if (msgv){
        sql += " and lh.MSGV = ?"
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