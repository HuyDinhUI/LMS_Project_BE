import { pool } from "../Db/connection.js";
import { v4 as uuidv4 } from "uuid";
const SendMessage = async (data, MaNguoiGui) => {
  const { MaLop, NoiDung } = data;

  if (!MaLop || !MaNguoiGui || !NoiDung) {
    throw Error("Thiếu dữ liệu");
  }

  const connection = await pool.getConnection();

  try {
    const [threadRows] = await connection.query(
        `
        SELECT MaThread FROM InboxThread WHERE MaLop = ? LIMIT 1
        `
        ,[MaLop]
    )

    let MaThread = threadRows[0]?.MaThread
    if (!MaThread) {
        MaThread = uuidv4()
        await connection.query(
            `
            INSERT INTO InboxThread (MaThread, MaLop,TieuDe,NgayTao) VALUES (?,?,?,NOW())
            `
            ,[MaThread, MaLop, `Chat class ${MaLop}`]
        )
    }

    const MaTin = uuidv4()
    await connection.query(
        `
        INSERT INTO InboxMessage (MaTin, MaThread, MaNguoiGui, NoiDung, ThoiGianGui) VALUES (?, ?, ?, ?, NOW())
        `
        ,[MaTin, MaThread, MaNguoiGui, NoiDung]
    )

    return {data: MaThread}
  } catch (err) {
    throw err;
  }
  finally {
    connection.release()
  }
};

const getAllInboxByTeacher = async (msgv) => {
    try{
        const [inbox] = await pool.query(
            `
            SELECT it.*,lh.ten_lop, lh.cover
            from InboxThread it 
            join LopHoc lh on lh.MaLop = it.MaLop 
            where lh.MSGV = ?
            `
            ,[msgv]
        )

        return {data: inbox}
    }
    catch(err){
        throw err
    }

}

const getAllInboxByStudent = async (MaSV) => {
    try{
        const [inbox] = await pool.query(
            `
            SELECT it.*,lh.ten_lop, lh.cover
            from InboxThread it 
            join LopHoc lh on lh.MaLop = it.MaLop 
            join DangKyHocPhan dkhp on dkhp.MaLop = lh.MaLop 
            join SinhVien sv on sv.MaSV = dkhp.MaSV 
            where sv.MaSV = ?
            `
            ,[MaSV]
        )

        return {data: inbox}
    }
    catch(err){
        throw err
    }
}

const getAllMessageByStudent = async (MaSV, MaThread) => {
    try{
        const [message] = await pool.query(
            `
            SELECT 
            im.*, 
            t.MaLop, 
            lh.ten_lop, 
            lh.cover,
            COALESCE(sv.hoten, gv.hoten) AS hoten,
            CASE 
            WHEN sv.MaSV IS NOT NULL THEN 'SV' 
            WHEN gv.MSGV IS NOT NULL THEN 'GV' 
            END AS VaiTro
            FROM InboxMessage im
            JOIN InboxThread t ON im.MaThread = t.MaThread
            JOIN LopHoc lh ON lh.MaLop = t.MaLop
            JOIN DangKyHocPhan dk ON dk.MaLop = t.MaLop
            LEFT JOIN SinhVien sv ON sv.MaSV = im.MaNguoiGui
            LEFT JOIN GiangVien gv ON gv.MSGV = im.MaNguoiGui
            WHERE dk.MaSV = ? AND t.MaThread = ?
            ORDER BY im.ThoiGianGui ASC
            `
            ,[MaSV,MaThread]
        )

        return {data:message}
    }
    catch(err){
        throw err
    }
}

const getAllMessageByTeacher = async (msgv, MaThread) => {
    try{
        const [message] =await pool.query(
            `
            SELECT im.*, t.MaLop, lh.ten_lop , lh.cover,
            COALESCE(sv.hoten, gv.hoten) AS hoten,
            CASE 
            WHEN sv.MaSV IS NOT NULL THEN 'SV' 
            WHEN gv.MSGV IS NOT NULL THEN 'GV' 
            END AS VaiTro
            FROM InboxMessage im
            JOIN InboxThread t ON im.MaThread = t.MaThread
            JOIN LopHoc lh ON lh.MaLop = t.MaLop
            LEFT JOIN SinhVien sv ON sv.MaSV = im.MaNguoiGui
            LEFT JOIN GiangVien gv ON gv.MSGV = im.MaNguoiGui
            WHERE lh.MSGV = ? and t.MaThread = ?
            ORDER BY im.ThoiGianGui ASC
            `
            ,[msgv, MaThread]
        )

        return {data:message}
    }
    catch(err){
        throw err
    }
}

export const InboxService = {
  SendMessage,
  getAllInboxByStudent,
  getAllMessageByStudent,
  getAllInboxByTeacher,
  getAllMessageByTeacher
};
