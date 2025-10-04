import { EnrollCourseService } from "../Services/EnrollClassCourseService.js";

const getClassCourseByProgram = async (req, res, next) => {
  const { manganh, mahp } = req.query;
  try {
    const result = await EnrollCourseService.getClassCourseByProgram(
      manganh,
      mahp
    );
    res
      .status(200)
      .json({ message: "Lấy danh sách lớp học phần thành công", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCourseByProgram = async (req, res, next) => {
  try {
    const result = await EnrollCourseService.getCourseByProgram(
      req.params.manganh
    );
    res
      .status(200)
      .json({ message: "Lấy danh sách học phần thành công", result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const enrollClassCourse = async (req, res, next) => {
  const { MaSV, MaLop, MaHK, HocPhi, MaHP } = req.body;

  try {
    const result = await EnrollCourseService.enrollClassCourse(
      MaSV,
      MaLop,
      MaHK,
      HocPhi,
      MaHP
    );
    res.status(200).json({ message: "Đăng ký học phần thành công", result });
  } catch (err) {
    res.status(400).json({ messgae: err.message });
  }
};

export const EnrollCourseController = {
  getClassCourseByProgram,
  enrollClassCourse,
  getCourseByProgram,
};
