import express from "express"
import { ScheduleTeacherController } from "../../Controllers/ScheduleController.js"

const Router = express.Router()

Router.route('/getAllSchedule').get(ScheduleTeacherController.getSchedule)

export const ScheduleTeacherRouter = Router