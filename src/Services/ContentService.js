import { v4 as uuidv4 } from "uuid";
import path from "path";
import { UPLOAD_DIR_PATH } from "../Middlewares/uploadMiddleware.js";
import { pool } from "../Db/connection.js";
import { fixFormDataNull } from "../Utils/normalize.js";

const createContent = async (body, file, userId) => {
  const { tieu_de, MaLop, mota, id_youtube, title_youtube, thumbnail_youtube } = body;
  const connection = await pool.getConnection();
  const MaNoiDung = uuidv4();
  let filePath = ''
  try {
    await connection.beginTransaction();

    // Thêm nội dung
    await connection.query(
      `Insert into NoiDungHoc (MaNoiDung,tieu_de,MaLop,mota,ngay_tao, userId) VALUES (?,?,?,?,NOW(),?)`,
      [MaNoiDung, tieu_de, MaLop, mota || null,userId]
    );

    if (fixFormDataNull(id_youtube)) {
      await connection.query(
        `Insert into Youtube (id, title, thumbnail, MaNoiDung) VALUES (?,?,?,?)`,
        [id_youtube, title_youtube, thumbnail_youtube, MaNoiDung]
      );
    }

    if (file) {
      const filePath = `contents/${file.filename}`;
      // Thêm tài liệu
      await connection.query(
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
    }

    await connection.commit();

    return {
      MaNoiDung,
      tieu_de,
      MaLop,
      mota,
      file: {
        original_name: file?.originalname ?? null,
        file_name: file?.filename ?? null,
        mime_type: file?.mimetype ?? null,
        size: file?.size ?? null,
        path: filePath,
      },
      youtube: {
        id: id_youtube ?? null,
        title: title_youtube ?? null,
        thumnnail: thumbnail_youtube ?? null,
      },
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

const getContentByOneClass = async (MaLop) => {
  try {
    const [content] = await pool.query(
      `
            select distinct ndh.MaNoiDung,
            ndh.tieu_de,
            ndh.mota,
            ndh.huong_dan,
            tl.file_name,
            tl.file_path,
            tl.mime_type,
            tl.original_name,
            ndh.ngay_tao,
            y.id as youtube_id,
            y.title as youtube_title,
            y.thumbnail,
            al.fullname as hoten,
            al.username as userId
            from NoiDungHoc ndh 
            join LopHoc lh on ndh.MaLop = lh.MaLop
            left join Youtube y on ndh.MaNoiDung = y.MaNoiDung
            left join TaiLieu tl on ndh.MaNoiDung = tl.MaNoiDung 
            join Account_List al on ndh.userId =  al.username
            where ndh.MaLop = ?
            order by ndh.ngay_tao DESC
            `,
      [MaLop]
    );

    return { data: content };
  } catch (err) {
    throw err;
  }
};

const deleteContentById = async (MaNoiDung) => {
  try {
    await pool.query("delete from NoiDungHoc where MaNoiDung = ?", [MaNoiDung]);
    return { MaNoiDung };
  } catch (err) {
    throw err;
  } finally {
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
            tl.original_name,
            y.id as youtube_id,
            y.title as youtube_title,
            y.thumbnail
            from NoiDungHoc ndh 
            join LopHoc lh on ndh.MaLop = lh.MaLop
            left join Youtube y on ndh.MaNoiDung = y.MaNoiDung
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
  updateContent,
};
