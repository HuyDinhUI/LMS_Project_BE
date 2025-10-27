import express from "express"
import { InboxController } from "../../Controllers/InboxController.js"
import { authMiddleware } from "../../Middlewares/authMiddleware.js"

const Router = express.Router()

Router.route('/sendMessage').post(authMiddleware.isAuthozied,InboxController.SendMessage)

Router.route('/getAllInboxByTeacher').get(authMiddleware.isAuthozied,InboxController.getAllInboxByTeacher)

Router.route('/getAllInboxByStudent').get(authMiddleware.isAuthozied,InboxController.getAllInboxByStudent)

Router.route('/getAllMessageByStudent/:mathread').get(authMiddleware.isAuthozied,InboxController.getAllMessageByStudent)

Router.route('/getAllMessageByTeacher/:mathread').get(authMiddleware.isAuthozied,InboxController.getAllMessageByTeacher)

export const InboxRouter = Router