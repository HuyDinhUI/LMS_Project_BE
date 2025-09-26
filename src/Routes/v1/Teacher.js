import express from "express"
import {TeacherController} from "../../Controllers/TeacherController.js"

const Router = express.Router()

Router.route('/getAllTeacher').get(TeacherController.getAllTeacher)


export const TeacherRouter = Router