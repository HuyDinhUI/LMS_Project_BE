import express from "express";
import {TeacherRouter} from "./Teacher.js"
import StatusCodes from "http-status-codes"
import { ScheduleTeacherRouter } from "./ScheduleTeacher.js";
import { CourseRouter } from "./Course.js";
import { ClassCourseRouter } from "./ClassCourse.js";


const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use" });
});

Router.use('/teacher',TeacherRouter)

Router.use('/teacher/schedule',ScheduleTeacherRouter)

Router.use('/course',CourseRouter)

Router.use('/classCourse',ClassCourseRouter)


export const APIs_v1 = Router
  

