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
            ch.MaCauHoi,
            ch.NoiDung AS NoiDungCauHoi,
            ch.Diem,
            ch.CorrectIndex,
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
      CauHoi: [],
    };

    const map = new Map();

    questions.forEach((r) => {
      if (!map.has(r.MaCauHoi)) {
        map.set(r.MaCauHoi, {
          MaCauHoi: r.MaCauHoi,
          NoiDung: r.NoiDungCauHoi,
          LoaiCauHoi: r.LoaiCauHoi,
          Diem: parseFloat(r.Diem),
          CorrectIndex: r.CorrectIndex,
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
  } = data;

  try {
    const MaTN = uuidv4();

    await pool.query(
      `Insert into TracNghiem (MaTN,MaLop,TieuDe,MoTa,ThoiGianLam,TongDiem,HanNop,NgayTao,isRandom,SoLanChoPhep) 
            VALUES (?,?,?,?,?,?,?,NOW(),?,?)`,
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
      ]
    );

    for (const ch of CauHoi) {
      const MaCauHoi = uuidv4();
      await pool.query(
        `Insert into CauHoi (MaCauHoi, MaTN, NoiDung, Diem, CorrectIndex)
                VALUES (?,?,?,?,?)`,
        [MaCauHoi, MaTN, ch.NoiDung, TongDiem / CauHoi.length, ch.CorrectIndex]
      );

      for (const da of ch.DapAn) {
        const MaDapAn = uuidv4();
        await pool.query(
          `Insert into DapAn (MaDapAn, MaCauHoi, NoiDung, LaDapAnDung)
                    VALUES (?,?,?,?)`,
          [MaDapAn, MaCauHoi, da.NoiDung, da.LaDapAnDung]
        );
      }
    }

    return { data: MaTN };
  } catch (err) {
    
    throw err;
  }
};

const updateQuiz = async () => {};

const deleteQuiz = async () => {};

export const QuizService = {
  getQuizByClass,
  getQuestionById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
