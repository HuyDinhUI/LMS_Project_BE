import { ScheduleTeacherService } from "../Services/ScheduleService.js";

const getSchedule = async (req, res, next) => {
  const { keyword, sortBy, order, page, limit } = req.query;
  try {
    const result = await ScheduleTeacherService.getSchedule(
      keyword,
      sortBy,
      order,
      page,
      limit
    );

    res
      .status(200)
      .json({ sucess: true, message: "Lấy lịch thành công", data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const ScheduleTeacherController = {
  getSchedule,
};
