import { AttendanceService } from "../Services/AttendanceService.js";
import { JwtProvider } from "../Utils/JwtProvider.js";
import { NotificationService } from "../Services/NotificationService.js";

const faceId = async (req, res) => {
  const masv = req.jwtDecoded.username;
  const { MaLop, ngay_day } = req.body;
  const token = await JwtProvider.generateToken(
    { masv, MaLop, ngay_day },
    process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
    "2m"
  );

  res.json({
    redirectUrl: `${process.env.URI_FACEID}?token=${token}`,
  });
};

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
  const io = req.app.get("io");
  try {
    await AttendanceService.record(MaSV, MaLop, status, ngay_day);
    io.to(`user_${MaSV}`).emit("receive_notification", {
      message: `You have successfully taken attendance for ${MaLop}`,
      title: "Attendance",
      create_at: new Date(),
    });
    res.status(200).json({ message: "Cập nhật điểm danh thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const AttendanceController = {
  faceId,
  getAttendanceByTeacher,
  getAttendanceByStudent,
  record,
};
