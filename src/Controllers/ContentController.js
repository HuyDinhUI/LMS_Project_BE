import { ContentService } from "../Services/ContentService.js"

const createContent = async (req, res, next) => {
    try{
        const result = await ContentService.createContent(req.body,req.file)
        res.status(201).json({message: 'Tạo nội dung thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const getContentByOneClass = async (req, res, next) => {
    try{
        const result = await ContentService.getContentByOneClass(req.params.malop)
        res.status(200).json({message: 'Lấy danh sách nội dung thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

const deleteContentById = async (req, res, next) => {
    try{
        const result = await ContentService.deleteContentById(req.params.manoidung)
        res.status(200).json({message: 'Xoá nội dung thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

export const ContentController = {
    createContent,
    getContentByOneClass,
    deleteContentById
}