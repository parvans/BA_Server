import express from 'express'
import { getUserProfile, getallUsers, login, resetPassword, signup, verifyCode, verifyEmail } from '../controllers/user-controller.js'
const router = express.Router()
router.get('/getallusers', getallUsers)
router.post('/usersignup',signup)
router.post('/userlogin', login)
router.post('/verifyemail',verifyEmail)
router.post('/verifyotp',verifyCode)
router.post('/resetpassword',resetPassword)
router.get('/userprofile',getUserProfile)
export default router