import express from "express";
import {TeacherRouter} from "./Teacher.js"
import StatusCodes from "http-status-codes"
import { ScheduleTeacherRouter } from "./ScheduleTeacher.js";


const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use" });
});

Router.use('/teacher',TeacherRouter)

Router.use('/teacher/schedule',ScheduleTeacherRouter)


export const APIs_v1 = Router
  

