import express from "express"
import {authMiddleware} from "../../Middlewares/authMiddleware.js"
import { NotificationController } from "../../Controllers/NotificationController.js"

const Router = express.Router()

Router.use(authMiddleware.isAuthozied)

Router.route('/send').post(NotificationController.sendNotification)

export const NotificationRouter = Router