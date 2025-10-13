import { v4 as uuidv4 } from "uuid";
import { pool } from "../Db/connection.js";

const getAllAssignments = async (MaLop) => {
  try {
    const [assignments] = await pool.query(
      "SELECT * FROM BaiTap where MaLop = ? ORDER BY NgayTao DESC",
      [MaLop]
    );
    return { data: assignments };
  } catch (err) {
    throw err;
  }
};

const getAssignmentById = async (MaBaiTap) => {
  try {
    const [assignment] = await pool.query(
      "SELECT * FROM BaiTap WHERE MaBaiTap = ?",
      [MaBaiTap]
    );
    if (assignment.length === 0) {
      throw new Error("Không tìm thấy bài tập");
    }
    return { data: assignment };
  } catch (err) {
    throw err;
  }
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
  try {
    await pool.query("DELETE FROM BaiTap WHERE MaBaiTap = ?", [MaBaiTap]);

    return { MaBaiTap };
  } catch (err) {
    throw err;
  }
};

const getListSubmited = async (MaBaiTap) => {
  try {
    const [submissions] = await pool.query(
      `SELECT 
      bt.MaBaiTap,
      bt.TieuDe,
      sv.MaSV,
      sv.hoten,
      nb.file_name,
      nb.file_path,
      nb.mime_type,
      nb.original_name,
      nb.thoigian_nop AS thoigian_nop,
      nb.diem AS DiemSo,
      nb.MaNopBai,
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
      WHERE bt.MaBaiTap = ?
      ORDER BY bt.NgayTao DESC; `,
      [MaBaiTap]
    );

    return { data: submissions };
  } catch (err) {
    throw err;
  }
};

const getAssignmentByStudent = async (MaSV, MaLop) => {
  try {
    const [assignments] = await pool.query(
      `SELECT 
      bt.MaBaiTap,
      bt.TieuDe,
      bt.NoiDung,
      bt.HanNop,
      bt.GioNop,
      bt.DiemToiDa,
      bt.file_name,
      bt.file_path,
      bt.mime_type,
      bt.original_name,
      bt.size,
      bt.NgayTao,
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
      WHERE sv.MaSV  = ? and lh.MaLop = ?
      ORDER BY bt.NgayTao DESC;`,
      [MaSV, MaLop]
    );
    return { data: assignments };
  } catch (err) {
    throw err;
  }
};

const Submited = async (body, file) => {
  const { MaBaiTap, MaSV } = body;
  const MaNopBai = uuidv4();
  try {
    const filePath = `contents/${file.filename}`;
    const [existingSubmission] = await pool.query(
      "SELECT * FROM NopBai WHERE MaBaiTap = ? AND MaSV = ?",
      [MaBaiTap, MaSV]
    );
    if (existingSubmission.length > 0) {
      throw new Error("Sinh viên đã nộp bài tập này rồi.");
    }

    const [result] = await pool.query(
      "INSERT INTO NopBai (MaNopBai, MaBaiTap, MaSV, thoigian_nop, file_name, file_path, mime_type, original_name, size) VALUES (?, ?, ?, NOW(),? , ?, ?, ?, ?)",
      [
        MaNopBai,
        MaBaiTap,
        MaSV,
        file.filename,
        filePath,
        file.mimetype,
        Buffer.from(file.originalname, "latin1").toString("utf8"),
        file.size,
      ]
    );
    return {
      MaNopBai,
      MaBaiTap,
      MaSV,
      file: {
        original_name: file.originalname,
        file_name: file.filename,
        mime_type: file.mimetype,
        size: file.size,
        path: filePath,
      },
    };
  } catch (err) {
    throw err;
  }
};

const getSubmissionByStudentAndAssignment = async (MaSV, MaBaiTap) => {
  try {
    const [submission] = await pool.query(
      "SELECT * FROM NopBai WHERE MaSV = ? AND MaBaiTap = ?",
      [MaSV, MaBaiTap]
    );
    if (submission.length === 0) {
      throw new Error("Không tìm thấy bài nộp");
    }
    return { data: submission };
  } catch (err) {
    throw err;
  }
};

const Scoring = async (MaSV, MaBaiTap, Diem) => {
  try {
    const [result] = await pool.query(
      "UPDATE NopBai SET diem = ? WHERE MaSV = ? and MaBaiTap = ?",
      [Diem, MaSV, MaBaiTap]
    );
    if (result.affectedRows === 0) {
      throw new Error("Không tìm thấy bài nộp để chấm điểm");
    }
    return { MaBaiTap, MaSV, Diem };
  } catch (err) {
    throw err;
  }
};

const getGrades = async (MaLop) => {
  try {
    // lấy danh sách tiêu đề bài tập
    const [assignments] = await pool.query(
      `SELECT DISTINCT TieuDe FROM BaiTap bt
     JOIN LopHoc lh ON bt.MaLop = lh.MaLop
     WHERE lh.MaLop = ?`,
      [MaLop]
    );

    // Sinh ra phần SELECT động
    const pivotColumns = assignments
      .map(
        (bt) =>
          `MAX(
        CASE
          WHEN bt.TieuDe = '${bt.TieuDe}' THEN
            CASE
              WHEN nb.MaSV IS NULL THEN 'Chưa nộp'
              WHEN nb.diem IS NULL THEN 'Đã nộp (Chưa chấm)'
              WHEN nb.thoigian_nop > bt.HanNop THEN CONCAT(nb.diem, ' (Nộp trễ)')
              ELSE CONCAT(nb.diem, ' (Đúng hạn)')
            END
        END
      ) AS \`${bt.TieuDe}\`

        `
      )
      .join(", ");

    const sql = `
    SELECT 
      sv.MaSV,
      sv.hoten,
      ${pivotColumns},
      ROUND(AVG(nb.diem), 2) AS 'Trung bình'
    FROM BaiTap bt
    JOIN LopHoc lh ON bt.MaLop = lh.MaLop
    JOIN DangKyHocPhan dkhp ON dkhp.MaLop = lh.MaLop
    JOIN SinhVien sv ON sv.MaSV = dkhp.MaSV
    LEFT JOIN NopBai nb 
      ON nb.MaSV = sv.MaSV 
      AND nb.MaBaiTap = bt.MaBaiTap
    WHERE lh.MaLop = ?
    GROUP BY sv.MaSV, sv.hoten
    ORDER BY sv.MaSV;
  `;

    const [grades] = await pool.query(sql, [MaLop]);
    return { data: grades };
  } catch (err) {
    throw err;
  }
};



export const AssignmentsService = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getListSubmited,
  getAssignmentByStudent,
  Submited,
  getSubmissionByStudentAndAssignment,
  Scoring,
  getGrades,
};
