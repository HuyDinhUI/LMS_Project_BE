import express from "express"
import { StudentController } from "../../Controllers/StudentController.js"

const Router = express.Router()

Router.route('/getAllStudent').get(StudentController.getAllStudent)

Router.route('/getOneStudent/:masv').get(StudentController.getOneStudent)

Router.route('/createStudent').post(StudentController.createStudent)

Router.route('/updateStudent').put(StudentController.updateStudent)

Router.route('/deleteStudent/:masv').delete(StudentController.deleteStudent)

export const StudentRouter = Router