import { GradesService } from "../Services/GradesService.js"

const getGradesByStudent = async (req,res,next) => {
    try{
        const result = await GradesService.getGradesByStudent(req.params.masv)
        res.status(200).json({message: 'Lấy bảng điểm thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

export const GradesController = {
    getGradesByStudent
}