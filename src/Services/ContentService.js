import { v4 as uuidv4 } from "uuid";
import { pool } from "../Db/connection.js";
import { fixFormDataNull } from "../Utils/normalize.js";

const createContent = async (body, file, userId) => {
  const { tieu_de, MaLop, mota, id_youtube, title_youtube, thumbnail_youtube } =
    body;
  const connection = await pool.getConnection();
  const MaNoiDung = uuidv4();
  try {
    await connection.beginTransaction();

    // Thêm nội dung
    await connection.query(
      `Insert into NoiDungHoc (MaNoiDung,tieu_de,MaLop,mota,ngay_tao, userId) VALUES (?,?,?,?,NOW(),?)`,
      [MaNoiDung, tieu_de, MaLop, mota || null, userId]
    );

    if (fixFormDataNull(id_youtube)) {
      await connection.query(
        `Insert into Youtube (id, title, thumbnail, MaNoiDung) VALUES (?,?,?,?)`,
        [id_youtube, title_youtube, thumbnail_youtube, MaNoiDung]
      );
    }

    if (file) {
      file.forEach(async (f) => {
        const filePath = `contents/${f.filename}`;
        // Thêm tài liệu
        await connection.query(
          `Insert into TaiLieu (MaNoiDung,file_name, file_path, mime_type,original_name, size) VALUES (?,?,?,?,?,?)`,
          [
            MaNoiDung,
            f.filename,
            filePath,
            f.mimetype,
            Buffer.from(f.originalname, "latin1").toString("utf8"),
            f.size,
          ]
        );
      });
    }

    await connection.commit();

    return {
      MaNoiDung,
      tieu_de,
      MaLop,
      mota,
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

    const map = new Map();

    content.forEach((c) => {
      if (!map.has(c.MaNoiDung)) {
        map.set(c.MaNoiDung, {
          MaNoiDung: c.MaNoiDung,
          tieu_de: c.tieu_de,
          mota: c.mota,
          huong_dan: c.huong_dan,
          ngay_tao: c.ngay_tao,
          files: [],
          create_by: {
            hoten: c.hoten,
            userId: c.userId,
          },
          videos: [],
        });
      }
      if (c.file_name) {
        map.get(c.MaNoiDung).files.push({
          file_name: c.file_name,
          file_path: c.file_path,
          mime_type: c.mime_type,
          original_name: c.original_name,
        });
      }

      if (c.youtube_id) {
        map.get(c.MaNoiDung).videos.push({
          youtube_id: c.youtube_id,
          youtube_title: c.youtube_title,
          thumbnail: c.thumbnail,
        });
      }
    });
    
    return { data: Array.from(map.values()) };
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

    const map = new Map();

    content.forEach((c) => {
      if (!map.has(c.MaNoiDung)) {
        map.set(c.MaNoiDung, {
          MaNoiDung: c.MaNoiDung,
          tieu_de: c.tieu_de,
          mota: c.mota,
          huong_dan: c.huong_dan,
          ngay_tao: c.ngay_tao,
          files: [],
          create_by: {
            hoten: c.hoten,
            userId: c.userId,
          },
          videos: [],
        });
      }
      if (c.file_name) {
        map.get(c.MaNoiDung).files.push({
          file_name: c.file_name,
          file_path: c.file_path,
          mime_type: c.mime_type,
          original_name: c.original_name,
        });
      }

      if (c.youtube_id) {
        map.get(c.MaNoiDung).videos.push({
          youtube_id: c.youtube_id,
          youtube_title: c.youtube_title,
          thumbnail: c.thumbnail,
        });
      }
    });

    return { data: Array.from(map.values())[0] };
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
    }

    await connection.commit();

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
