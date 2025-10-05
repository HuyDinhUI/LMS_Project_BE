import express from "express"
import { MajorController } from "../../Controllers/MajorController.js"

const Router = express.Router()

Router.route('/getAllMajor').get(MajorController.getAllMajor)

export const MajorRouter = Router