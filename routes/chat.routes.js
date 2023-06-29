import express from 'express';
import auth from '../middleware/auth.js';
import { accessthechat, createGroupChat, fetchChat } from '../controllers/chat-controller.js';
const router = express.Router();

router.post('/acceschat',auth,accessthechat)
router.get('/fetchchat',auth,fetchChat)
router.post('/creategroupchat',auth,createGroupChat)
export default router;