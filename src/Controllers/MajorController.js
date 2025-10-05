import { MajorService } from "../Services/MajorService.js"

const getAllMajor = async (req, res, next) => {
    try{
        const result = await MajorService.getAllMajor()
        res.status(200).json({message: 'Lấy danh sách chuyên ngành thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
} 


export const MajorController = {
    getAllMajor
}