import express from 'express';
import auth from '../middleware/auth.js';
import { allMessage, sendMessage } from '../controllers/messageControlls.js';
const router = express.Router();
router.post('/sendmessage',auth,sendMessage)
router.get('/:chatId',auth,allMessage)
export default router;