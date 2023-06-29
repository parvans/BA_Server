import express from 'express'
import { getOtherUsers, getUserProfile, getallUsers, login, resetPassword, signup, verifyCode, verifyEmail } from '../controllers/user-controller.js'
import auth from '../middleware/auth.js'
const router = express.Router()
router.get('/getallusers', getallUsers)
router.post('/usersignup',signup)
router.post('/userlogin', login)
router.post('/verifyemail',verifyEmail)
router.post('/verifyotp',verifyCode)
router.post('/resetpassword',resetPassword)
router.get('/userprofile',auth,getUserProfile)
router.get('/getotherusers',auth,getOtherUsers)
export default router