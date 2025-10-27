import { AssignmentsService } from "../Services/AssignmentsService.js";

const getAllAssignments = async (req, res) => {
  try {
    const result = await AssignmentsService.getAllAssignments(req.params.malop);
    res
      .status(200)
      .json({ message: "Lấy danh sách bài tập thành công", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const result = await AssignmentsService.getAssignmentById(
      req.params.mabaitap
    );
    res
      .status(200)
      .json({ message: "Lấy thông tin bài tập thành công", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createAssignment = async (req, res) => {
  try {
    const result = await AssignmentsService.createAssignment(
      req.body,
      req.file
    );
    res.status(201).json({ message: "Tạo bài tập thành công", result });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAssignment = async (req, res) => {
  // Logic to update an existing assignment
};

const deleteAssignment = async (req, res) => {
  try {
    const result = await AssignmentsService.deleteAssignment(
      req.params.mabaitap
    );
    res.status(200).json({ message: "Xóa bài tập thành công", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getListSubmited = async (req, res) => {
  try {
    const result = await AssignmentsService.getListSubmited(
      req.params.mabaitap
    );
    res
      .status(200)
      .json({ message: "Lấy danh sách nộp bài thành công", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAssignmentByStudent = async (req, res) => {
  try {
    const result = await AssignmentsService.getAssignmentByStudent(
      req.params.masv,
      req.params.malop
    );
    res.status(200).json({
      message: "Lấy thông tin bài tập của sinh viên thành công",
      result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Submited = async (req, res) => {
  try {
    const result = await AssignmentsService.Submited(req.body, req.file);
    res.status(201).json({ message: "Nộp bài tập thành công", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubmissionByStudentAndAssignment = async (req, res) => {
  try {
    const result = await AssignmentsService.getSubmissionByStudentAndAssignment(
      req.params.masv,
      req.params.mabaitap
    );
    res
      .status(200)
      .json({ message: "Lấy thông tin bài nộp thành công", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Scoring = async (req, res) => {
  try {
    const result = await AssignmentsService.Scoring(
      req.body.MaSV,
      req.body.MaBaiTap,
      req.body.Diem
    );
    res.status(200).json({ message: "Chấm điểm thành công", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGrades = async (req, res) => {
  try {
    const result = await AssignmentsService.getGrades(req.params.malop);
    res.status(200).json({ message: "Lấy bảng điểm thành công", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getAllDueSoonByStudent = async (req, res) => {
  const masv = req.jwtDecoded.username
  try{
    const result = await AssignmentsService.getAllDueSoonByStudent(masv)
    res.status(200).json({ message: "Lấy danh sách bài tập thành công", result });
  }
  catch(err) {
    res.status(400).json({ message: error.message });
  }
}

export const AssignmentsController = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getListSubmited,
  getAssignmentByStudent,
  Submited,
  getSubmissionByStudentAndAssignment,
  Scoring,
  getGrades,
  getAllDueSoonByStudent
};
