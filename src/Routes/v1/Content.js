import express from "express"
import { upload } from "../../Middlewares/uploadMiddleware.js"
import { ContentController } from "../../Controllers/ContentController.js"

const Router = express.Router()

Router.route('/create').post(upload.single("file"),ContentController.createContent)

Router.route('/getByOneClass/:malop').get(ContentController.getContentByOneClass)

Router.route('/delete/:manoidung').delete(ContentController.deleteContentById)

Router.route('/getOneById/:manoidung').get(ContentController.getOneContentById)

Router.route('/update').put(upload.single("file"),ContentController.updateContent)

export const ContentRouter = Router