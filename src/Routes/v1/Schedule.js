import express from "express"
import { ScheduleTeacherController } from "../../Controllers/ScheduleController.js"

const Router = express.Router()

Router.route('/getAllSchedule').get(ScheduleTeacherController.getSchedule)

Router.route('/getScheduleById/:malich').get(ScheduleTeacherController.getScheduleById)

Router.route('/updateSchedule').put(ScheduleTeacherController.updateSchedule)

export const ScheduleTeacherRouter = Router