import express from 'express'
import userController from '../controllers/user-controller.js'
const router=express.Router()
router.get('/',userController.getallUsers)
router.post('/signup',userController.signup)
router.post('/login',userController.login)
export default router