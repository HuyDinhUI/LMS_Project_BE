import express from "express"
import { EnrollCourseController } from "../../Controllers/EnrollClassCourseController.js"

const Router = express.Router()

Router.route('/getClassCourseByProgram').get(EnrollCourseController.getClassCourseByProgram)

Router.route('/getCourseByProgram/:manganh').get(EnrollCourseController.getCourseByProgram)

Router.route('/enroll').post(EnrollCourseController.enrollClassCourse)

Router.route('/getEnrolledCourse/:masv').get(EnrollCourseController.getErolledCourseById)

Router.route('/cancle').delete(EnrollCourseController.CancleEnrollCourse)

export const EnrollClassCourseRouter = Router