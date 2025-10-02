import {TeacherService} from "../Services/TeacherService.js"
import StatusCode from "http-status-codes"

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

const createTeacher = async (req, res, next) => {
    try {
        const result = await TeacherService.createTeacher(req.body)
        res.status(200).json(result)
    }
    catch (err){
        res.status(400).json({message: err.message})
    }
}

const deleteTeacher = async (req, res, next) => {
    try {
        const result = await TeacherService.deleteTeacher(req.params.msgv)
        res.status(200).json(result)
    }
    catch (err){
        res.status(400).json({message: err.message})
    }
}

const getOneTeacher = async (req, res, next) => {
    try{
        const result = await TeacherService.getOneTeacher(req.params.msgv)
        if (!result){
            res.status(StatusCode.NOT_FOUND).json({message: "Không tìm thấy giảng viên"})
        }
        res.status(200).json(result)
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

const updateTeacher = async (req, res, next) => {
    try{
        const result = await TeacherService.updateTeacher(req.body)
        res.status(200).json(result)
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

const getSchedule = async (req, res, next) => {
    try{
        const result = await TeacherService.getSchedule(req.params.msgv)
        res.status(200).json({message: 'Lấy lịch thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

export const TeacherController = {
    getAllTeacher,
    createTeacher,
    deleteTeacher,
    getOneTeacher,
    updateTeacher,
    getSchedule
}