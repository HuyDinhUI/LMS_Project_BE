import { StudentService } from "../Services/StudentService.js";

const getAllStudent = async (req, res, next) => {
  const { keyword, gioitinh,Khoa, sortBy, order, page, limit } = req.query;
  try {
    const result = await StudentService.getAllStudent(
      keyword,
      gioitinh,
      Khoa,
      sortBy,
      order,
      page,
      limit
    );
    res
      .status(200)
      .json({ message: "Lấy danh sách sinh viên thành công", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getOneStudent = async (req, res, next) => {
  try {
    const result = await StudentService.getOneStudent(req.params.masv);
    res.status(200).json({ message: "Lấy sinh viên thành công", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createStudent = async (req, res, next) => {
  try {
    const result = await StudentService.createStudent(req.body);
    res.status(200).json({ message: "Tạo sinh viên thành công", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const result = await StudentService.updateStudent(req.body);
    res.status(200).json({ message: "Cập nhật sinh viên thành công", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteStudent = async () => {};

const getSchedule = async (req, res, next) => {
  try {
    const result = await StudentService.getSchedule(req.params.masv);
    res.status(200).json({ message: "Lấy lịch thành công", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const StudentController = {
  getAllStudent,
  getOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getSchedule,
};
