import express from "express"
import {TeacherController} from "../../Controllers/TeacherController.js"
import {TeacherValidation} from "../../Validations/TeacherValidations.js"

const Router = express.Router()

Router.route('/getAllTeacher').get(TeacherController.getAllTeacher)

Router.route('/getOneTeacher/:msgv').get(TeacherController.getOneTeacher)

Router.route('/createTeacher').post(TeacherValidation.createTeacher,TeacherController.createTeacher)

Router.route('/deleteTeacher/:msgv').delete(TeacherController.deleteTeacher)

Router.route('/updateTeacher').put(TeacherController.updateTeacher)

Router.route('/getSchedule/:msgv').get(TeacherController.getSchedule)

export const TeacherRouter = Router