import express from "express"
import { AcccountController } from "../../Controllers/AccountController.js"
import {authMiddleware} from "../../Middlewares/authMiddleware.js"

const Router = express.Router()

Router.use(authMiddleware.isAuthozied)

Router.route('/get/all').get(AcccountController.getAllAccount)

export const AccountRouter = Router