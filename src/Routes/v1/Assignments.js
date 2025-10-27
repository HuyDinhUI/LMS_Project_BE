import express from 'express';
import { AssignmentsController } from '../../Controllers/AssignmentsController.js';
import { upload } from '../../Middlewares/uploadMiddleware.js';
import { authMiddleware } from "../../Middlewares/authMiddleware.js"

const Router = express.Router();

Router.route('/getAssignmentsByClass/:malop').get(authMiddleware.isAuthozied,AssignmentsController.getAllAssignments);
Router.route('/getAssignmentById/:mabaitap').get(authMiddleware.isAuthozied,AssignmentsController.getAssignmentById);
Router.route('/create').post(upload.single("file"),authMiddleware.isAuthozied,AssignmentsController.createAssignment);
Router.route('/update/:id').put(authMiddleware.isAuthozied,AssignmentsController.updateAssignment);
Router.route('/delete/:mabaitap').delete(authMiddleware.isAuthozied,AssignmentsController.deleteAssignment);
Router.route('/getListSubmited/:mabaitap').get(authMiddleware.isAuthozied,AssignmentsController.getListSubmited); 
Router.route('/getAssignmentByStudent/:masv/:malop').get(authMiddleware.isAuthozied,AssignmentsController.getAssignmentByStudent);
Router.route('/submit').post(upload.single("file"),authMiddleware.isAuthozied,AssignmentsController.Submited);
Router.route('/getSubmissionByStudentAndAssignment/:masv/:mabaitap').get(authMiddleware.isAuthozied,AssignmentsController.getSubmissionByStudentAndAssignment);
Router.route('/scoring').post(authMiddleware.isAuthozied,AssignmentsController.Scoring);
Router.route('/getGrades/:malop').get(authMiddleware.isAuthozied,AssignmentsController.getGrades);
Router.route('/getAllDueSoon').get(authMiddleware.isAuthozied,AssignmentsController.getAllDueSoonByStudent)

export const AssignmentsRouter = Router;