import { pool } from "../Db/connection.js";
import { CreateMaCongNo } from "../Utils/create_id.js";

const getCourseByProgram = async (manganh) => {
  try {
    const [course] = await pool.query(
      `
            SELECT 
            hp.MaHP,
            MAX(hp.ten_hocphan) AS ten_hocphan,
            MAX(ctk.MaNganh) AS MaNganh,
            MAX(hp.HocPhi) AS HocPhi,
            MAX(hp.so_tinchi) AS so_tinchi
            FROM HocPhan hp
            JOIN ChuongTrinhKhung ctk ON ctk.MaHP = hp.MaHP
            WHERE ctk.MaNganh = ?
            GROUP BY hp.MaHP`,
      [manganh]
    );

    if (course.length === 0) {
      throw Error("Chương trình khung không tồn tại");
    }

    return { data: course };
  } catch (err) {
    throw err;
  }
};

const getClassCourseByProgram = async (manganh, mahp) => {
  try {
    const [classCourse] = await pool.query(
      `SELECT 
        lh.MaLop,
        MAX(lh.ten_lop) AS ten_lop,
        MAX(lh.si_so) AS si_so,
        MAX(lh.sl_dangky) AS sl_dangky,
        MAX(lh.phonghoc) AS phonghoc,
        MAX(hp.HocPhi) AS HocPhi,
        MAX(gv.hoten) AS giangvien,
        MAX(ld.tiet_batdau) AS tiet_batdau,
        MAX(ld.tiet_kethuc) AS tiet_kethuc,
        MAX(ld.ThuTrongTuan) AS ThuTrongTuan,
        MAX(lh.MaHK) AS MaHK
        FROM LopHoc lh
        JOIN LichDay ld ON lh.MaLop = ld.MaLop
        JOIN GiangVien gv ON lh.MSGV = gv.MSGV
        JOIN HocPhan hp ON lh.MaHP = hp.MaHP
        JOIN ChuongTrinhKhung ctk ON ctk.MaHP = lh.MaHP
        WHERE ctk.MaNganh = ? and ctk.MaHP = ?
        GROUP BY lh.MaLop;`,
      [manganh, mahp]
    );

    if (classCourse.length === 0) {
      throw Error("Chưa có lớp nào cho học phần này");
    }

    return { data: classCourse };
  } catch (err) {
    throw err;
  }
};

const enrollClassCourse = async (MaSV, MaLop, MaHK, HocPhi, MaHP) => {
  try {
    // kiểm tra số lượng đã đăng ký
    const [soluong] = await pool.query(
      "select si_so, sl_dangky from LopHoc where MaLop = ?",
      [MaLop]
    );

    if (soluong[0].sl_dangky === soluong[0].si_so) {
      throw Error("Lớp đã đủ số lượng");
    }

    // update lại số lượng

    await pool.query(
      "update LopHoc set sl_dangky = ? where MaLop = ?"
      ,[soluong[0].sl_dangky + 1,MaLop]
    )

    //B1: thêm vào bảng đăng ký học phần
    await pool.query(
      "insert into DangKyHocPhan (MaSV,MaLop,MaHK,TrangThai,NgayDangKy) VALUES (?,?,?,?,NOW())",
      [MaSV, MaLop, MaHK, "Đã đăng ký"]
    );

    const MaCongNo = CreateMaCongNo(MaSV);
    //B2: thêm vào công nợ
    await pool.query(
      "insert into CongNo (MaCongNo,MaSV,MaLop,HocPhi,DaDong,ConNo,TrangThai) VALUES (?,?,?,?,?,?,?)",
      [MaCongNo, MaSV, MaLop, HocPhi, 0, HocPhi, "Còn nợ"]
    );
    //B3: tạo bảng điểm
    await pool.query("insert into BangDiem (MaSV,MaHP) VALUES (?,?)", [
      MaSV,
      MaHP,
    ]);

    return {
      MaSV,
      MaLop,
      MaHK,
      HocPhi,
      MaHP,
    };
  } catch (err) {
    throw err;
  }
};

export const EnrollCourseService = {
  getClassCourseByProgram,
  enrollClassCourse,
  getCourseByProgram,
};
