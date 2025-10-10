import { v4 as uuidv4 } from "uuid";
import { pool } from "../Db/connection.js";

const getAllAssignments = async (MaLop) => {
  try {
    const [assignments] = await pool.query("SELECT * FROM BaiTap where MaLop = ? ORDER BY NgayTao DESC",[MaLop]);
    return { data: assignments };
  } catch (err) {
    throw err;
  }
};

const getAssignmentById = async (id) => {
  // Logic to get an assignment by ID
};

const createAssignment = async (body, file) => {
  const { NoiDung, MaLop, TieuDe, HanNop, GioNop, DiemToiDa } = body;
  const MaBaiTap = uuidv4();

  try {
    if (file) {
      const filePath = `contents/${file.filename}`;
      const [assignment] = await pool.query(
        `INSERT INTO BaiTap 
      (MaBaiTap, NoiDung,MaLop, TieuDe, HanNop, file_name, file_path, mime_type, original_name, size, NgayTao,GioNop,DiemToiDa) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(),?,?)`,
        [
          MaBaiTap,
          NoiDung,
          MaLop,
          TieuDe,
          HanNop || null,
          file.filename,
          filePath,
          file.mimetype,
          Buffer.from(file.originalname, "latin1").toString("utf8"),
          file.size,
          GioNop || null,
          DiemToiDa || null,
        ]
      );
      return {
        MaBaiTap,
        NoiDung,
        MaLop,
        TieuDe,
        HanNop,
        file: {
          original_name: file.originalname,
          file_name: file.filename,
          mime_type: file.mimetype,
          size: file.size,
          path: filePath,
        },
      };
    } else {
      const [assignment] = await pool.query(
        `INSERT INTO BaiTap (MaBaiTap, NoiDung,MaLop, TieuDe, HanNop, NgayTao,GioNop,DiemToiDa) 
             VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          MaBaiTap,
          NoiDung,
          MaLop,
          TieuDe,
          HanNop || null,
          GioNop || null,
          DiemToiDa || null,
        ]
      );
      return {
        MaBaiTap,
        NoiDung,
        MaLop,
        TieuDe,
        HanNop,
        GioNop,
        DiemToiDa,
      };
    }
  } catch (err) {
    throw err;
  }
};

const updateAssignment = async (id, assignmentData) => {
  // Logic to update an existing assignment
};

const deleteAssignment = async (MaBaiTap) => {
  try{
    await pool.query("DELETE FROM BaiTap WHERE MaBaiTap = ?", [MaBaiTap]);

    return {MaBaiTap}
  }
  catch(err){
    throw err;
  }
};

const getListSubmited = async (MaBaiTap) => {
  try {
    const [submissions] = await pool.query(
      `SELECT 
      bt.MaBaiTap,
      sv.MaSV,
      sv.hoten,
      nb.file_name,
      nb.file_path,
      nb.mime_type,
      nb.original_name,
      nb.thoigian_nop AS ThoiGianNop,
      nb.diem AS DiemSo,
      CASE
          WHEN nb.MaSV IS NULL THEN 'Chưa nộp'
          WHEN nb.thoigian_nop > bt.HanNop THEN 'Nộp trễ'
          ELSE 'Đã nộp'
      END AS TrangThai
      FROM BaiTap bt
      JOIN LopHoc lh ON bt.MaLop = lh.MaLop
      JOIN DangKyHocPhan dkhp ON dkhp.MaLop = lh.MaLop
      JOIN SinhVien sv ON sv.MaSV = dkhp.MaSV
      LEFT JOIN NopBai nb 
          ON nb.MaSV = sv.MaSV 
          AND nb.MaBaiTap = bt.MaBaiTap
      WHERE bt.MaBaiTap = ?; `
      ,[MaBaiTap]
    )

    return { data: submissions };
  }
  catch(err){
    throw err;
  }
}

export const AssignmentsService = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getListSubmited
};
