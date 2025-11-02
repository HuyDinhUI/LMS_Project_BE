import express from 'express';
import { AssignmentsController } from '../../Controllers/AssignmentsController.js';
import { upload } from '../../Middlewares/uploadMiddleware.js';
import { authMiddleware } from "../../Middlewares/authMiddleware.js"

const Router = express.Router();

Router.use(authMiddleware.isAuthozied)

Router.route('/getAssignmentsByClass/:malop').get(AssignmentsController.getAllAssignments);
Router.route('/getAssignmentById/:mabaitap').get(AssignmentsController.getAssignmentById);
Router.route('/create').post(upload.single("file"),AssignmentsController.createAssignment);
Router.route('/update/:id').put(AssignmentsController.updateAssignment);
Router.route('/delete/:mabaitap').delete(AssignmentsController.deleteAssignment);
Router.route('/getListSubmited/:mabaitap').get(AssignmentsController.getListSubmited); 
Router.route('/getAssignmentByStudent/:masv/:malop').get(AssignmentsController.getAssignmentByStudent);
Router.route('/submit').post(upload.single("file"),AssignmentsController.Submited);
Router.route('/getSubmissionByStudentAndAssignment/:masv/:mabaitap').get(AssignmentsController.getSubmissionByStudentAndAssignment);
Router.route('/scoring').post(AssignmentsController.Scoring);
Router.route('/getGrades/:malop').get(AssignmentsController.getGrades);
Router.route('/getAllDueSoon').get(AssignmentsController.getAllDueSoonByStudent)
Router.route('/getAllDueSoonByTeacher').get(AssignmentsController.getAllDueSoonByTeacher)

export const AssignmentsRouter = Router;