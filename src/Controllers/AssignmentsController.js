import { AssignmentsService } from "../Services/AssignmentsService.js";

const getAllAssignments = async (req, res) => {
    try{
        const result = await AssignmentsService.getAllAssignments(req.params.malop);
        res.status(200).json({message: 'Lấy danh sách bài tập thành công', result});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

const getAssignmentById = async (req, res) => {
    // Logic to get an assignment by ID
}

const createAssignment = async (req, res) => {
    try{
        const result = await AssignmentsService.createAssignment(req.body, req.file);
        res.status(201).json({ message: 'Tạo bài tập thành công',result });
    }
    catch(error){
        console.error('Error creating assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateAssignment = async (req, res) => {
    // Logic to update an existing assignment
}

const deleteAssignment = async (req, res) => {
    try{
        const result = await AssignmentsService.deleteAssignment(req.params.mabaitap);
        res.status(200).json({message: 'Xóa bài tập thành công', result});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

const getListSubmited = async (req, res) => {
    try{
        const result = await AssignmentsService.getListSubmited(req.params.mabaitap);
        res.status(200).json({message: 'Lấy danh sách nộp bài thành công', result});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

export const AssignmentsController = {
    getAllAssignments,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getListSubmited
}