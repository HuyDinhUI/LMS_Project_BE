import { pool } from "../Db/connection.js";
import { v4 as uuidv4 } from "uuid";

const getQuizByClass = async (MaLop) => {
  try {
    const [quiz] = await pool.query(
      "Select * from TracNghiem where MaLop = ?",
      [MaLop]
    );

    return { data: quiz };
  } catch (err) {
    throw err;
  }
};

const getQuestionById = async (MaTN) => {
  try {
    const [questions] = await pool.query(
      `
            SELECT 
            q.MaTN ,
            q.TieuDe AS TieuDeQuiz,
            q.isRandom,
            ch.MaCauHoi,
            ch.NoiDung AS NoiDungCauHoi,
            ch.Diem,
            da.MaDapAn,
            da.NoiDung AS NoiDungDapAn
            FROM TracNghiem q
            JOIN CauHoi ch ON q.MaTN  = ch.MaTN  
            JOIN DapAn da ON ch.MaCauHoi = da.MaCauHoi
            WHERE q.MaTN  = ?
            ORDER BY ch.MaCauHoi, da.MaDapAn;
            `,
      [MaTN]
    );

    const quiz = {
      MaTN: MaTN,
      TieuDe: questions[0]?.TieuDeQuiz || "",
      isRandom: questions[0]?.isRandom,
      CauHoi: [],
    };

    const map = new Map();

    questions.forEach((r) => {
      if (!map.has(r.MaCauHoi)) {
        map.set(r.MaCauHoi, {
          MaCauHoi: r.MaCauHoi,
          NoiDung: r.NoiDungCauHoi,
          Diem: parseFloat(r.Diem),
          DapAn: [],
        });
      }
      map.get(r.MaCauHoi).DapAn.push({
        MaDapAn: r.MaDapAn,
        NoiDung: r.NoiDungDapAn,
        LaDapAnDung: r.LaDapAnDung,
      });
    });

    quiz.CauHoi = Array.from(map.values());

    return { data: quiz };
  } catch (err) {
    throw err;
  }
};

const createQuiz = async (data) => {
  const {
    MaLop,
    TieuDe,
    MoTa,
    ThoiGianLam,
    HanNop,
    CauHoi,
    TongDiem,
    isRandom,
    SoLanChoPhep,
    LoaiTracNghiem
  } = data;

  const connection = await pool.getConnection();

  try {
    const MaTN = uuidv4();

    await connection.beginTransaction();

    await connection.query(
      `Insert into TracNghiem (MaTN,MaLop,TieuDe,MoTa,ThoiGianLam,TongDiem,HanNop,NgayTao,isRandom,SoLanChoPhep,LoaiTracNghiem) 
            VALUES (?,?,?,?,?,?,?,NOW(),?,?,?)`,
      [
        MaTN,
        MaLop,
        TieuDe,
        MoTa,
        ThoiGianLam,
        TongDiem,
        HanNop,
        isRandom,
        SoLanChoPhep,
        LoaiTracNghiem
      ]
    );

    for (const ch of CauHoi) {
      const MaCauHoi = uuidv4();
      await connection.query(
        `Insert into CauHoi (MaCauHoi, MaTN, NoiDung, Diem)
                VALUES (?,?,?,?)`,
        [MaCauHoi, MaTN, ch.NoiDung, TongDiem / CauHoi.length]
      );

      for (const da of ch.DapAn) {
        const MaDapAn = uuidv4();
        await connection.query(
          `Insert into DapAn (MaDapAn, MaCauHoi, NoiDung, LaDapAnDung)
                    VALUES (?,?,?,?)`,
          [MaDapAn, MaCauHoi, da.NoiDung, da.LaDapAnDung]
        );
      }
    }

    await connection.commit();

    return { data: MaTN };
  } catch (err) {
    throw err;
    await connection.rollback();
  } finally {
    connection.release();
  }
};

const updateQuiz = async () => {};

const deleteQuiz = async () => {};

const submitQuiz = async (data) => {
  const { MaTN, MaSV, Answers } = data;
  const connection = await pool.getConnection();
  try {
    if (!MaTN || !MaSV || !Array.isArray(Answers)) {
      throw Error("Thiếu dữ liệu gửi lên");
    }
    await connection.beginTransaction();

    const [questions] = await connection.query(
      `
      SELECT MaCauHoi, Diem
      FROM CauHoi
      WHERE MaTN = ?
      `,
      [MaTN]
    );

    if (questions.length === 0) throw Error("Quiz không tồn tại");

    const cauHoiIds = Answers.map((c) => c.MaCauHoi).filter(Boolean);

    const [correctAnswers] = await connection.query(
      `
      SELECT MaCauHoi, MaDapAn
      FROM DapAn
      WHERE MaCauHoi IN (?) AND LaDapAnDung = 1
      `,
      [cauHoiIds.length ? cauHoiIds : [0]]
    );

    const correctMap = {};
    correctAnswers.forEach((row) => {
      if (!correctMap[row.MaCauHoi]) correctMap[row.MaCauHoi] = new Set();
      correctMap[row.MaCauHoi].add(String(row.MaDapAn));
    });

    const MaBaiLam = uuidv4();

    const [insertResult] = await connection.query(
      `INSERT INTO BaiLamTracNghiem (MaBaiLam,MaTN, MaSV, TongDiem, TrangThai, ThoiGianNop)
      VALUES (?,?,?, 0,'Đã hoàn thành',NOW())
      `,
      [MaBaiLam, MaTN, MaSV]
    );

    let totalScore = 0;

    for (const ans of Answers) {
      const { MaCauHoi, SelectedMaDapAn } = ans;
      const q = questions.find((x) => String(x.MaCauHoi) === String(MaCauHoi));
      if (!q) continue;

      const diem = Number(q.Diem) || 0;
      let dung = false;

      if (SelectedMaDapAn != null) {
        const set = correctMap[MaCauHoi] || new Set();

        if (set.has(String(SelectedMaDapAn))) {
          dung = true;
        }
      } else {
        dung = false;
      }

      const scored = dung ? diem : 0;
      totalScore += scored;

      const MaChiTiet = uuidv4();

      await connection.query(
        `INSERT INTO ChiTietBaiLam (MaChiTiet, MaBaiLam, MaCauHoi, SelectedMaDapAn, Dung, Diem)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [MaChiTiet, MaBaiLam, ans.MaCauHoi, SelectedMaDapAn, dung ? 1 : 0, scored]
      );
    }

    await connection.query(
      `
      UPDATE BaiLamTracNghiem SET TongDiem = ? WHERE MaBaiLam = ?
      `,
      [totalScore, MaBaiLam]
    );
    await connection.commit();

    return { data: { MaBaiLam, TongDiem: totalScore } };
  } catch (err) {
    throw err;
    await connection.rollback();
  } finally {
    connection.release();
  }
};

const getQuizByStudent = async (MaSV,MaLop) => {
  try{
    const [quiz] = await pool.query(`
      select distinct
      tn.MaTN,
      tn.TieuDe ,
      tn.MoTa ,
      tn.HanNop ,
      tn.TongDiem ,
      tn.TrangThai ,
      tn.isRandom ,
      tn.SoLanChoPhep ,
      tn.ThoiGianLam ,
      tn.NgayTao ,
      tn.LoaiTracNghiem,
      case 
        when bltn.MaSV is null and NOW() > tn.HanNop then 0
        else bltn.TongDiem  
      end as DiemSo,
      case 
        WHEN bltn.MaSV IS NULL THEN 'Chưa nộp'
            WHEN bltn.ThoiGianNop > tn.HanNop THEN 'Nộp trễ'
            ELSE 'Đã nộp'
      end as TrangThaiNopBai
      from TracNghiem tn 
      join LopHoc lh on tn.MaLop = lh.MaLop 
      join DangKyHocPhan dkhp on dkhp.MaLop = dkhp.MaLop 
      join SinhVien sv on sv.MaSV = dkhp.MaSV 
      left join BaiLamTracNghiem bltn on bltn.MaSV = sv.MaSV and bltn.MaTN = tn.MaTN 
      where sv.MaSV = ? and lh.MaLop = ?
      order by tn.NgayTao DESC
      `,[MaSV,MaLop])
    return {data: quiz}
  }
  catch(err){
    throw err
  }
}

export const QuizService = {
  getQuizByClass,
  getQuestionById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizByStudent
};
