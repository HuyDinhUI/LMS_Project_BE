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
      `,
      [msgv, malop]
    );

    return { data: groups };
  } catch (err) {
    throw err;
  }
};

const getOneGroup = async (MaNhom, user_role, user_id, MaLop) => {
  try {
    let group
    if (user_role == 'GV') {
      [group] = await pool.query(
      `
      SELECT gl.* FROM GroupClass gl
      JOIN LopHoc lh on lh.MaLop = gl.MaLop
      WHERE lh.MSGV = ? and lh.MaLop = ? and gl.MaNhom = ?
      `,
      [user_id, MaLop, MaNhom]
    );
    }

    else {
      [group] = await pool.query(
        `
        select gc.* 
        from GroupClass gc 
        join GroupMembers gm on gm.MaNhom = gc.MaNhom
        where gm.MaSV = ? and gc.MaLop = ? and gc.MaNhom = ?
        `
        ,[user_id, MaLop, MaNhom]
      )
    }

    return {data: group}
  } catch (err) {
    throw err
  }
}
 
const getMembersOneGroup = async (MaNhom, MaSV, role) => {
  try {
    const [members] = await pool.query(
      `
      SELECT gm.* , sv.hoten, sv.avatar
      FROM GroupMembers gm
      JOIN SinhVien sv on sv.MaSV = gm.MaSV
      WHERE MaNhom = ?
      `,
      [MaNhom]
    );

    const ids = members.map((m) => m.MaSV);

    if (ids.includes(MaSV) || role === "GV") {
      return { data: members };
    } else {
      throw Error("Bạn không phải là thành viên của nhóm này!");
    }
  } catch (err) {
    throw err;
  }
};

const createGroup = async (data, created_by) => {
  const { name, description, MaLop, max_members } = data;

  try {
    const MaNhom = uuid();
    await pool.query(
      `INSERT INTO GroupClass 
      (MaNhom, MaLop, name, description, max_members, created_by, created_at, update_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [MaNhom, MaLop, name, description, max_members, created_by]
    );

    return { MaNhom };
  } catch (err) {
    throw err;
  }
};

const addMember = async (data, user_role) => {
  const { MaNhom, MaSV } = data;
  const connection = await pool.getConnection();
  try {
    const [members] = await connection.query(
      `
      SELECT * FROM GroupMembers
      WHERE MaNhom = ?
      `,
      [MaNhom]
    );

    const [group] = await connection.query(
      `
    SELECT current_member, max_members FROM GroupClass
    WHERE MaNhom = ?
    `,
      [MaNhom]
    );

    let role = "";
    const ids = members.map((m) => m.MaSV);
    const member = members.find((m) => (m.MaSV = MaSV));

    if (members.length === 0) {
      role = "leader";
      await connection.query(
        `
      INSERT INTO GroupMembers (MaNhom, MaSV, role, joined_at) VALUES (?, ?, ?, NOW())
      `,
        [MaNhom, MaSV, role]
      );

      await connection.query(
        `
        UPDATE GroupClass SET current_member = ? where MaNhom = ?
        `,
        [group[0].current_member + 1, MaNhom]
      );

      return { MaNhom, MaSV, role };
    } else {
      role = "member";

      if (member.role === "leader" || user_role === "GV") {
        
        if (ids.includes(MaSV)) {
          throw Error("Sinh viên này đã tồn tại trong nhóm!");
        }

        if (group[0].current_member === group[0].max_members) {
          throw Error("Nhóm đã đủ thành viên!");
        }

        await connection.query(
          `
        INSERT INTO GroupMembers (MaNhom, MaSV, role, joined_at) VALUES (?, ?, ?, NOW())
        `,
          [MaNhom, MaSV, role]
        );

        await connection.query(
          `
        UPDATE GroupClass SET current_member = ? WHERE MaNhom = ?
        `,
          [group[0].current_member + 1, MaNhom]
        );
      } else {
        throw Error('Bạn không có quyền thêm thành viên!')
      }
    }

    return { MaNhom, MaSV, role };
  } catch (err) {
    throw err;
  }
};

const getGroupByStudent = async (MaSV, MaLop) => {
  try {
    const [groups] = await pool.query(
      `
      select gc.* 
      from GroupClass gc 
      join GroupMembers gm on gm.MaNhom = gc.MaNhom
      where gm.MaSV = ? and gc.MaLop = ?
      `,
      [MaSV, MaLop]
    );

    return { data: groups };
  } catch (err) {
    throw err;
  }
};

export const GroupService = {
  getAllGroup,
  createGroup,
  getMembersOneGroup,
  addMember,
  getGroupByStudent,
  getOneGroup
};
