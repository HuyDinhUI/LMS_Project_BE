import StatusCode from "http-status-codes"
import { InboxService } from "../Services/InboxService.js"

const SendMessage = async (req, res) => {
    const MaNguoiGui = req.jwtDecoded.username
    try{
        const result = await InboxService.SendMessage(req.body,MaNguoiGui)
        res.status(StatusCode.OK).json({message: 'Gửi tin nhắn thành công',result}) 
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const getAllInboxByTeacher = async (req, res) => {
    const msgv = req.jwtDecoded.username
    try{
        const result = await InboxService.getAllInboxByTeacher(msgv)
        res.status(StatusCode.OK).json({message:'Lấy danh sách inbox thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const getAllInboxByStudent = async (req, res) => {
    const masv = req.jwtDecoded.username
    try{
        const result = await InboxService.getAllInboxByStudent(masv)
        res.status(StatusCode.OK).json({message:'Lấy danh sách inbox thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const getAllMessageByStudent = async (req, res) => {
    const masv = req.jwtDecoded.username
    try{
        const result = await InboxService.getAllMessageByStudent(masv,req.params.mathread)
        res.status(StatusCode.OK).json({message:'Lấy danh sách inbox thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const getAllMessageByTeacher = async (req, res) => {
    const msgv = req.jwtDecoded.username
    try{
        const result = await InboxService.getAllMessageByTeacher(msgv,req.params.mathread)
        res.status(StatusCode.OK).json({message:'Lấy danh sách inbox thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

export const InboxController = {
    SendMessage,
    getAllInboxByTeacher,
    getAllInboxByStudent,
    getAllMessageByStudent,
    getAllMessageByTeacher
}