import express from "express";
import { QuizController } from "../../Controllers/QuizController.js";
import { upload } from "../../Middlewares/uploadMiddleware.js";

const Router = express.Router();

Router.route("/getQuizByClass/:malop").get(QuizController.getQuizByClass);

Router.route("/getQuestionById/:matn").get(QuizController.getQuestionById);

Router.route("/createQuiz").post(QuizController.createQuiz);

Router.route("/submitQuiz").post(QuizController.submitQuiz);

Router.route("/getQuizByStudent/:masv/:malop").get(
  QuizController.getQuizByStudent
);

Router.route("/getSubmissions/:matn").get(QuizController.getListSubmited);

Router.route("/getGrades/:malop").get(QuizController.getGrades);

Router.route("/delete/:matn").delete(QuizController.deleteQuiz);

Router.route("/update").put(QuizController.updateQuiz);

Router.route("/detailSubmitted/:matn/:mabailam").get(
  QuizController.detailSubmitted
);

Router.route("/import").post(upload.single("file"), QuizController.importQuiz);

export const QuizRouter = Router;
