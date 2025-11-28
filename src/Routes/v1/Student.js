import express from "express"
import { StudentController } from "../../Controllers/StudentController.js"
import { upload } from '../../Middlewares/uploadMiddleware.js';

const Router = express.Router()

Router.route('/getAllStudent').get(StudentController.getAllStudent)

Router.route('/getOneStudent/:masv').get(StudentController.getOneStudent)

Router.route('/createStudent').post(upload.single("file"),StudentController.createStudent)

Router.route('/updateStudent').put(StudentController.updateStudent)

Router.route('/deleteStudent/:masv').delete(StudentController.deleteStudent)

Router.route('/getSchedule/:masv').get(StudentController.getSchedule)

export const StudentRouter = Router