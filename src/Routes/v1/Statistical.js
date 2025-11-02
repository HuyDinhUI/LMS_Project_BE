import express from "express"
import { authMiddleware } from "../../Middlewares/authMiddleware.js"
import { StatisticalController } from "../../Controllers/StatisticalController.js"

const Router = express.Router()

Router.use(authMiddleware.isAuthozied)

Router.route('/statusAssignment/:malop').get(StatisticalController.StatisticalAssignmentStatus)

export const StatisticalRouter = Router