import express from "express"
import {authMiddleware} from "../../Middlewares/authMiddleware.js"
import { GroupController } from "../../Controllers/GroupController.js"

const Router = express.Router()

Router.use(authMiddleware.isAuthozied)

Router.route('/get/all/:malop').get(GroupController.getAllGroup)

Router.route('/create').post(GroupController.createGroup)


export const GroupRouter = Router
