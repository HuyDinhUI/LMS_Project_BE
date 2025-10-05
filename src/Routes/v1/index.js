import express from "express";
import {TeacherRouter} from "./Teacher.js"
import StatusCodes from "http-status-codes"
import { ScheduleTeacherRouter } from "./Schedule.js";
import { CourseRouter } from "./Course.js";
import { ClassCourseRouter } from "./ClassCourse.js";
import { AuthRouter } from "./Auth.js";
import { StudentRouter } from "./Student.js";
import { EnrollClassCourseRouter } from "./EnrollClassCourse.js";
import { MajorRouter } from "./Major.js";
import { GradesRouter } from "./Grades.js";


const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use" });
});

Router.use('/auth', AuthRouter)

Router.use('/teacher',TeacherRouter)

Router.use('/schedule',ScheduleTeacherRouter)

Router.use('/course',CourseRouter)

Router.use('/classCourse',ClassCourseRouter)

Router.use('/student',StudentRouter)

Router.use('/enrollClassCourse',EnrollClassCourseRouter)

Router.use('/major',MajorRouter)

Router.use('/grades',GradesRouter)


export const APIs_v1 = Router
  

