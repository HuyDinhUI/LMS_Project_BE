import express from "express"
import { ScheduleTeacherController } from "../../Controllers/ScheduleTeacherController.js"

const Router = express.Router()

Router.route('/getSchedule').get(ScheduleTeacherController.getSchedule)

export const ScheduleTeacherRouter = Router