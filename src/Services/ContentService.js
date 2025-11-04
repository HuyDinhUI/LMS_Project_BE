import { v4 as uuidv4 } from "uuid";
import path from "path";
import { UPLOAD_DIR_PATH } from "../Middlewares/uploadMiddleware.js";
import { pool } from "../Db/connection.js";

const createContent = async (body, file) => {
  const { tieu_de, MaLop, mota } = body;
  const MaNoiDung = uuidv4();
  try {
    if (file) {
      const filePath = `contents/${file.filename}`;
      // Thêm nội dung
      const [content] = await pool.query(
        `Insert into NoiDungHoc (MaNoiDung,tieu_de,MaLop,mota,ngay_tao) VALUES (?,?,?,?,NOW())`,
        [MaNoiDung, tieu_de, MaLop, mota || null]
      );
      // Thêm tài liệu
      const [document] = await pool.query(
        `Insert into TaiLieu (MaNoiDung,file_name, file_path, mime_type,original_name, size) VALUES (?,?,?,?,?,?)`,
        [
          MaNoiDung,
          file.filename,
          filePath,
          file.mimetype,
          Buffer.from(file.originalname, "latin1").toString("utf8"),
          file.size,
        ]
      );

      return {
        MaNoiDung,
        tieu_de,
        MaLop,
        mota,
        file: {
          original_name: file.originalname,
          file_name: file.filename,
          mime_type: file.mimetype,
          size: file.size,
          path: filePath,
        },
      };
    } else {
      const [content] = await pool.query(
        `Insert into NoiDungHoc (MaNoiDung,tieu_de,MaLop,mota,ngay_tao) VALUES (?,?,?,?,NOW())`,
        [MaNoiDung, tieu_de, MaLop, mota || null]
      );

      return {
        MaNoiDung,
        tieu_de,
        MaLop,
        mota,
      };
    }
  } catch (err) {
    throw err;
  }
};

const getContentByOneClass = async (MaLop) => {
  try {
    const [content] = await pool.query(
      `
            select ndh.MaNoiDung ,
            MAX(ndh.tieu_de) as tieu_de,
            MAX(ndh.mota) as mota,
            MAX(ndh.huong_dan) as huong_dan,
            MAX(gv.hoten) as hoten,
            MAX(tl.file_name) as file_name,
            MAX(tl.file_path) as file_path,
            MAX(tl.mime_type) as mime_type,
            MAX(tl.original_name) as original_name,
            MAX(ndh.ngay_tao) as ngay_tao
            from NoiDungHoc ndh 
            join LopHoc lh on ndh.MaLop = lh.MaLop
            left join TaiLieu tl on ndh.MaNoiDung = tl.MaNoiDung 
            join GiangVien gv on lh.MSGV = gv.MSGV 
            where ndh.MaLop = ?
            group by ndh.MaNoiDung
            `,
      [MaLop]
    );

    return { data: content };
  } catch (err) {
    throw err;
  }
};

const deleteContentById = async (MaNoiDung) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await pool.query("delete from TaiLieu where MaNoiDung = ?", [MaNoiDung]);
    await pool.query("delete from NoiDungHoc where MaNoiDung = ?", [MaNoiDung]);
    await connection.commit();
    return { MaNoiDung };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const getOneContentById = async (MaNoiDung) => {
  try {
    const [content] = await pool.query(
      `
            select ndh.MaNoiDung ,
            ndh.tieu_de,
            ndh.mota,
            ndh.huong_dan,
            gv.hoten,
            tl.file_name,
            tl.file_path,
            tl.mime_type,
            tl.original_name
            from NoiDungHoc ndh 
            join LopHoc lh on ndh.MaLop = lh.MaLop
            left join TaiLieu tl on ndh.MaNoiDung = tl.MaNoiDung 
            join GiangVien gv on lh.MSGV = gv.MSGV 
            where ndh.MaNoiDung = ?
            `,
      [MaNoiDung]
    );

    return { data: content[0] };
  } catch (err) {
    throw err;
  }
};

const updateContent = async (data, file) => {
  const { tieu_de, mota, MaNoiDung } = data;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `Update NoiDungHoc set tieu_de = ?, mota = ? where MaNoiDung = ?`,
      [tieu_de, mota, MaNoiDung]
    );

    if (file) {
      const filePath = `contents/${file.filename}`;

      await connection.query(
        `Update TaiLieu set file_name = ?, file_path = ?,
        mime_type = ?, original_name = ?, size = ? where MaNoiDung = ?
        `,
        [
          file.filename,
          filePath,
          file.mimetype,
          Buffer.from(file.originalname, "latin1").toString("utf8"),
          file.size,
          MaNoiDung,
        ]
      );

      await connection.commit();

      return {
        MaNoiDung,
        tieu_de,
        mota,
        file: {
          original_name: file.originalname,
          file_name: file.filename,
          mime_type: file.mimetype,
          size: file.size,
          path: filePath,
        },
      };
    }

    return {
      MaNoiDung,
      tieu_de,
      mota,
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const ContentService = {
  createContent,
  getContentByOneClass,
  deleteContentById,
  getOneContentById,
  updateContent
};
