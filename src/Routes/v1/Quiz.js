import express from "express"
import { QuizController } from "../../Controllers/QuizController.js"

const Router = express.Router()

Router.route('/getQuizByClass/:malop').get(QuizController.getQuizByClass)

Router.route('/getQuestionById/:matn').get(QuizController.getQuestionById)

Router.route('/createQuiz').post(QuizController.createQuiz)

export const QuizRouter = Router