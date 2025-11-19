import express from "express"
import {authMiddleware} from "../../Middlewares/authMiddleware.js"
import { GroupController } from "../../Controllers/GroupController.js"

const Router = express.Router()

Router.use(authMiddleware.isAuthozied)

Router.route('/get/all/:malop').get(GroupController.getAllGroup)

Router.route('/create').post(GroupController.createGroup)

Router.route('/get/members/:manhom').get(GroupController.getMembersOneGroup)

Router.route('/add/member').post(GroupController.addMember)

Router.route('/get/groups/student/:malop').get(GroupController.getGroupByStudent)

Router.route('/get/group/:manhom/:malop').get(GroupController.getOneGroup)

export const GroupRouter = Router
