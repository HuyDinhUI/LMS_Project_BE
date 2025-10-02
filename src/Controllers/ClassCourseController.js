import { ClassCourseService } from "../Services/ClassCourseService.js";

const getAllClassCourse = async (req, res, next) => {
  const { keyword, sortBy, order, page, limit } = req.query;
  try {
    const result = await ClassCourseService.getAllClassCourse(
      keyword,
      sortBy,
      order,
      page,
      limit
    );
    res.status(200).json({ message: "Lấy lớp học phần thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createClassCourse = async (req, res, next) => {
  try {
    const result = await ClassCourseService.createClassCourse(req.body);
    res.status(200).json({ message: "Tạo lớp học phần thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateClassCourse = async (req, res, next) => {
  try {
    const result = await ClassCourseService.updateClassCourse(req.body);
    res
      .status(200)
      .json({ message: "Cập nhật lớp học phần thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteClassCourse = async (req, res, next) => {
  try{
    const result = await ClassCourseService.deleteClassCourse(req.params.malop)
    res.status(200).json({message: "Xoá lớp học phần thành công", result})
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
};

const getOneClassCourse = async (req, res, next) => {
  try {
    const result = await ClassCourseService.getOneClassCourse(req.params.malop);
    res.status(200).json({ message: "Lấy lớp học phần thành công", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClassCourseByTeacher = async (req, res, next) => {
  try {
    const result = await ClassCourseService.getClassCourseByTeacher(req.params.msgv)

    res.status(200).json({message: 'Lấy lớp học phần thành công',result})
  }
  catch(err){
    res.status(500).json({message: err.message})
  }
}

export const ClassCourseController = {
  getAllClassCourse,
  createClassCourse,
  updateClassCourse,
  deleteClassCourse,
  getOneClassCourse,
  getClassCourseByTeacher
};
