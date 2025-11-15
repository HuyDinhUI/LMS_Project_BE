import express from "express";
import {authMiddleware} from "../../Middlewares/authMiddleware.js"
import { AttendanceController } from "../../Controllers/AttendanceController.js";
 
const Router = express.Router();

Router.route("/start").post(authMiddleware.isAuthozied,AttendanceController.faceId)
Router.route("/get/:malop").get(authMiddleware.isAuthozied,AttendanceController.getAttendanceByTeacher);
Router.route("/student/get/:malop").get(authMiddleware.isAuthozied,AttendanceController.getAttendanceByStudent);
Router.route("/record").post(AttendanceController.record);

export const AttendanceRouter = Router;