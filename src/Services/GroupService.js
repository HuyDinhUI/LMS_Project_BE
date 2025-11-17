import { pool } from "../Db/connection.js";
import { v4 as uuid } from "uuid";

const getAllGroup = async (msgv, malop) => {
  try {
    const [groups] = await pool.query(
      `
      SELECT gl.* FROM GroupClass gl
      JOIN LopHoc lh on lh.MaLop = gl.MaLop
      WHERE lh.MSGV = ? and lh.MaLop = ?
      ORDER BY gl.created_at
      `
      ,[msgv, malop]
    )

    return {data: groups}

  } catch (err) {
    throw err
  }
}

const createGroup = async (data, created_by) => {
  const { name, description, MaLop, max_members } = data;

  try {
    const MaNhom = uuid();
    await pool.query(
      `INSERT INTO GroupClass 
      (MaNhom, MaLop, name, description, max_members, created_by, created_at, update_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [MaNhom, MaLop, name, description,max_members, created_by]
    );

    return { MaNhom };
  } catch (err) {
    throw err;
  }
};

export const GroupService = {
  getAllGroup,
  createGroup
};
