import express from "express"
import { GradesController } from "../../Controllers/GradesController.js"

const Router = express.Router()

Router.route('/getGradesByStudent/:masv').get(GradesController.getGradesByStudent)

export const GradesRouter = Router