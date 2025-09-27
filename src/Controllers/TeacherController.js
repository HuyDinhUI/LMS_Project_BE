import {TeacherService} from "../Services/TeacherService.js"

const getAllTeacher = async (req, res, next) => {
    try {
        const {keyword, gioitinh, sortBy, order, limit, page} = req.query
        const result = await TeacherService.getAllTeacher(keyword,gioitinh,sortBy,order,page,limit)
        res.status(200).json(result)
    }
    catch (err){
        res.status(400).json({message: err.message})
    }
}

export const TeacherController = {
    getAllTeacher
}