import express from 'express'
import { getallUsers, login, signup } from '../controllers/user-controller.js'
const router = express.Router()
router.get('/getallusers', getallUsers)
router.post('/usersignup',signup)
router.post('/userlogin', login)
export default router