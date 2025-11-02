import { StatisticalService } from "../Services/StatisticalService.js"

const StatisticalAssignmentStatus = async (req, res) => {
    const msgv = req.jwtDecoded.username
    try {
        const result = await StatisticalService.StatisticalAssignmentStatus(req.params.malop, msgv)
        res.status(200).json({message: "Lấy thống kê trạng thái bài tập thành công",result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

export const StatisticalController = {
    StatisticalAssignmentStatus
}