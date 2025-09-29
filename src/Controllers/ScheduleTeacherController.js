import { ScheduleTeacherService } from "../Services/ScheduleTeacherService.js"


const getSchedule = async (req, res, next) => {
    const {msgv, from, to} = req.query
     try{
        const result = await ScheduleTeacherService.getSchedule(msgv,from,to)
        
        res.status(200).json({sucess: true, message: "Lấy lịch thành công", data: result})
     }
     catch (err){
        console.log(err)
        res.status(500).json({success: false, message:err.message})
     }
}

export const ScheduleTeacherController = {
    getSchedule
}