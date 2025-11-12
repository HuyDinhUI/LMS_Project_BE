import express from "express";
import {authMiddleware} from "../../Middlewares/authMiddleware.js"
import { AttendanceController } from "../../Controllers/AttendanceController.js";
 
const Router = express.Router();

Router.use(authMiddleware.isAuthozied);

Router.route("/get/:malop").get(AttendanceController.getAttendanceByTeacher);
Router.route("/student/get/:malop").get(AttendanceController.getAttendanceByStudent);
Router.route("/record").post(AttendanceController.record);

export const AttendanceRouter = Router;