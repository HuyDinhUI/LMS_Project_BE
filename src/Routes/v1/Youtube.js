import express from "express"
import { YoutubeController } from "../../Controllers/YoutubeController.js"
import {authMiddleware} from "../../Middlewares/authMiddleware.js"

const Router = express.Router()

Router.use(authMiddleware.isAuthozied)

Router.route('/getVideos').get(YoutubeController.SearchVideoYoutube)

export const YoutubeRouter = Router