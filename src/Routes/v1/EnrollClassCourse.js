import express from "express"
import { EnrollCourseController } from "../../Controllers/EnrollClassCourseController.js"

const Router = express.Router()

Router.route('/getClassCourseByProgram').get(EnrollCourseController.getClassCourseByProgram)

Router.route('/getCourseByProgram/:manganh').get(EnrollCourseController.getCourseByProgram)

Router.route('/enroll').post(EnrollCourseController.enrollClassCourse)

export const EnrollClassCourseRouter = Router