import express from "express"
import { CourseController } from "../../Controllers/CourseController.js"

const Router = express.Router()

Router.route('/getAllCourse').get(CourseController.getAllCourse)

Router.route('/getOneCourse/:mahp').get(CourseController.getOneCourse)

Router.route('/createCourse').post(CourseController.createCourse)

Router.route('/updateCourse').put(CourseController.updateCourse)

Router.route('/deleteCourse/:mahp').delete(CourseController.deleteCourse)

export const CourseRouter = Router