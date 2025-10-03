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

const getScheduleById = async (req, res, next) => {
  try{
    const result = await ScheduleTeacherService.getScheduleById(req.params.malich)
    res.status(200).json({message: 'Lấy lịch thành công',result})
  }
  catch(err){
    res.status(400).json({message: err.message})
  }
}

const updateSchedule = async (req, res, next) => {
  try{
    const result = await ScheduleTeacherService.updateSchedule(req.body)
    res.status(200).json({message: 'Cập nhật lịch thành công', result})
  }
  catch(err){
    res.status(400).json({message: err.message})
  }
}

export const ScheduleTeacherController = {
  getSchedule,
  getScheduleById,
  updateSchedule
};
