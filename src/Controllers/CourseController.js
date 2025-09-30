import { CourseService } from "../Services/CourseService.js"

const getAllCourse = async (req, res, next) => {
    const {keyword, sortBy, order, page, limit} = req.query
    try{
        const result = await CourseService.getAllCourse(keyword, sortBy, order, page, limit)
        res.status(200).json({message: 'Lấy học phần thành công', result})
    }
    catch (err){
        res.status(500).json({message: err.message})
    }
}

const getOneCourse = async (req, res, next) => {
    try {
        const result = await CourseService.getOneCourse(req.params.mahp)
        res.status(200).json({message: 'Lấy học phần thành công', result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const createCourse = async (req, res, next) => {
    try {
        const result = await CourseService.createCourse(req.body)
        res.status(200).json({message: 'Tạo học phần thành công', result})
    }
    catch (err){
        res.status(500).json({message: err.message})
    }
}

const updateCourse = async (req, res, next) => {
    try {
        const result = await CourseService.updateCourse(req.body)
        res.status(200).json({message:'Cập nhật học phần thành công',result})
    }
    catch (err){
        res.status(500).json({message: err.message})
    }
}

const deleteCourse = async (req, res, next) => {
    try{
        const result = await CourseService.deleteCourse(req.params.mahp)

        res.status(200).json({message:'Xoá học phần thành công', result})
    }
    catch (err){
        res.status(500).json({message: err.message})
    }

}



export const CourseController = {
    getAllCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getOneCourse
}