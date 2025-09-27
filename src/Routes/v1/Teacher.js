import express from "express"
import {TeacherController} from "../../Controllers/TeacherController.js"
import {TeacherValidation} from "../../Validations/TeacherValidations.js"

const Router = express.Router()

Router.route('/getAllTeacher').get(TeacherController.getAllTeacher)

Router.route('/createTeacher').post(TeacherValidation.createTeacher,TeacherController.createTeacher)


export const TeacherRouter = Router