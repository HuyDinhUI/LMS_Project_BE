import { AttendanceService } from "../Services/AttendanceService.js";

const getAttendanceByTeacher = async (req, res) => {
  try {
    const result = await AttendanceService.getAttendanceByTeacher(
      req.params.malop
    );
    res
      .status(200)
      .json({ message: "Lấy danh sách điểm danh thành công", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAttendanceByStudent = async (req, res) => {
  const masv = req.jwtDecoded.username;
  try {
    const result = await AttendanceService.getAttendanceByStudent(
      req.params.malop,
      masv
    );
    res
      .status(200)
      .json({ message: "Lấy danh sách điểm danh thành công", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const record = async (req, res) => {
  const { MaLop, MaSV, status, ngay_day } = req.body;
  try {
    await AttendanceService.record(MaSV, MaLop, status, ngay_day);
    res.status(200).json({ message: "Cập nhật điểm danh thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const AttendanceController = {
  getAttendanceByTeacher,
  getAttendanceByStudent,
  record
};
