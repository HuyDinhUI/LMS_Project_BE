import express from "express"
import { QuizController } from "../../Controllers/QuizController.js"

const Router = express.Router()

Router.route('/getQuizByClass/:malop').get(QuizController.getQuizByClass)

Router.route('/getQuestionById/:matn').get(QuizController.getQuestionById)

Router.route('/createQuiz').post(QuizController.createQuiz)

Router.route('/submitQuiz').post(QuizController.submitQuiz)

Router.route('/getQuizByStudent/:masv/:malop').get(QuizController.getQuizByStudent)

export const QuizRouter = Router