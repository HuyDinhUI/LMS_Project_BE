import {TeacherService} from "../Services/TeacherService.js"

const getAllTeacher = async (req, res, next) => {
    try {
        const result = await TeacherService.getAllTeacher()
        res.status(200).json(result)
    }
    catch (err){
        res.status(400).json({message: err.message})
    }
}

export const TeacherController = {
    getAllTeacher
}