import express from "express"
import { AuthController } from "../../Controllers/AuthController.js"
import { authMiddleware } from "../../Middlewares/authMiddleware.js"

const Router = express.Router()

Router.route('/login').post(AuthController.Login)

Router.route('/getUserInfo').post(authMiddleware.isAuthozied,AuthController.getUserInfo)

Router.route('/logout').delete(AuthController.Logout)

export const AuthRouter = Router