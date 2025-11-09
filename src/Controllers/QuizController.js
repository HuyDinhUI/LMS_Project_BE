import {QuizService} from "../Services/QuizService.js"

const getQuizByClass = async (req, res) => {
    try{
        const result = await QuizService.getQuizByClass(req.params.malop)
        res.status(200).json({message: 'Lấy danh sách trắc nghiệm thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

const getQuestionById = async (req, res) => {
    try{
        const result = await QuizService.getQuestionById(req.params.matn)
        res.status(200).json({message: 'Lấy bộ câu hỏi thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

const createQuiz = async (req, res) => {
    try{
        const result = await QuizService.createQuiz(req.body)
        res.status(200).json({message: 'Tạo trắc nghiệm thành công', result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const submitQuiz = async (req, res) => {
    try{
        const result = await QuizService.submitQuiz(req.body)
        res.status(200).json({message: 'Nộp bài thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const getQuizByStudent = async (req, res) => {
    try{
        const result = await QuizService.getQuizByStudent(req.params.masv,req.params.malop)
        res.status(200).json({message: 'Lấy danh sách trắc nghiệm thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

const getListSubmited = async (req, res) => {
    try{
        const result = await QuizService.getListSubmited(req.params.matn)
        res.status(200).json({message: 'Lấy danh sách nộp bài thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

const getGrades = async (req, res) => {
    try{
        const result = await QuizService.getGrades(req.params.malop)
        res.status(200).json({message: 'Lấy danh sách điểm thành công',result})
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}

const deleteQuiz = async (req, res) => {
    try{
        const result = await QuizService.deleteQuiz(req.params.matn)
        res.status(200).json({message: 'Xoá trắc nghiệm thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const updateQuiz = async (req, res) => {
    try{
        const result = await QuizService.updateQuiz(req.body)
        res.status(200).json({message: 'Cập nhật thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const detailSubmitted = async (req, res) => {
    try{
        const result = await QuizService.detailSubmitted(req.params.matn,req.params.mabailam)
        res.status(200).json({message: 'Lấy danh sách chi tiết bài làm thành công',result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const importQuiz = async (req, res) => {
    try{
        const result = await QuizService.importQuiz(req.body, req.file)
        res.status(200).json({message: 'Import trắc nghiệm thành công', result})
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

export const QuizController = {
    getQuizByClass,
    getQuestionById,
    createQuiz,
    submitQuiz,
    getQuizByStudent,
    getListSubmited,
    getGrades,
    deleteQuiz,
    updateQuiz,
    detailSubmitted,
    importQuiz
}