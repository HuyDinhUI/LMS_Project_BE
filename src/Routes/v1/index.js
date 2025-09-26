import express from "express";
import {TeacherRouter} from "./Teacher.js"
import StatusCodes from "http-status-codes"


const Router = express.Router();

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use" });
});

Router.use('/teacher',TeacherRouter)


export const APIs_v1 = Router
  

