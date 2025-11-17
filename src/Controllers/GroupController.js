import { GroupService } from "../Services/GroupService.js"


const getAllGroup = async (req, res) => {
    const msgv = req.jwtDecoded.username
    try {
        const result = await GroupService.getAllGroup(msgv, req.params.malop)
        res.status(200).json({message: 'Lấy danh sách nhóm thành công', result})
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }

}
 
const createGroup = async (req, res) => {
    const created_by = req.jwtDecoded.username
    try {
        const result = await GroupService.createGroup(req.body, created_by)
        res.status(200).json({message: 'Tạo nhóm thành công',result})
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}
 
export const GroupController = {
    getAllGroup,
    createGroup
}