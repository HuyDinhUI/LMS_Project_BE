import { GroupService } from "../Services/GroupService.js";

const getAllGroup = async (req, res) => {
  const msgv = req.jwtDecoded.username;
  try {
    const result = await GroupService.getAllGroup(msgv, req.params.malop);
    res.status(200).json({ message: "Lấy danh sách nhóm thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createGroup = async (req, res) => {
  const created_by = req.jwtDecoded.username;
  try {
    const result = await GroupService.createGroup(req.body, created_by);
    res.status(200).json({ message: "Tạo nhóm thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMembersOneGroup = async (req, res) => {
  const masv = req.jwtDecoded.username;
  const role = req.jwtDecoded.role;

  try {
    const result = await GroupService.getMembersOneGroup(
      req.params.manhom,
      masv,
      role
    );
    res
      .status(200)
      .json({ message: "Lấy danh sách thành viên thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMember = async (req, res) => {
  const user_role = req.jwtDecoded.role;
  try {
    const result = await GroupService.addMember(req.body, user_role);
    res
      .status(200)
      .json({ message: "Thêm thành viên vào nhóm thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getGroupByStudent = async (req, res) => {
  const masv = req.jwtDecoded.username;
  try {
    const result = await GroupService.getGroupByStudent(masv, req.params.malop);
    res.status(200).json({ message: "Lấy danh sách nhóm thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOneGroup = async (req, res) => {
  const user_id = req.jwtDecoded.username;
  const user_role = req.jwtDecoded.role;

  try {
    const result = await GroupService.getOneGroup(
      req.params.manhom,
      user_role,
      user_id,
      req.params.malop
    );
    res.status(200).json({ message: "Lấy danh sách nhóm thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const GroupController = {
  getAllGroup,
  createGroup,
  getMembersOneGroup,
  addMember,
  getGroupByStudent,
  getOneGroup
};
