import express from "express"
import { ClassCourseController } from "../../Controllers/ClassCourseController.js"

const Router = express.Router()

Router.route('/getAllClassCourse').get(ClassCourseController.getAllClassCourse)

Router.route('/createClassCourse').post(ClassCourseController.createClassCourse)

Router.route('/updateClassCourse').put(ClassCourseController.updateClassCourse)

Router.route('/deleteClassCourse/:malop').delete(ClassCourseController.deleteClassCourse)

Router.route('/getOneClassCourse/:malop').get(ClassCourseController.getOneClassCourse)

Router.route('/getClassCourseByTeacher/:msgv').get(ClassCourseController.getClassCourseByTeacher)

Router.route('/getClassCourseByStudent/:masv').get(ClassCourseController.getClassCourseByStudent)

Router.route('/getMemberById/:malop').get(ClassCourseController.getMemberById)

export const ClassCourseRouter = Router