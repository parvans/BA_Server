import express from 'express';
import auth from '../middleware/auth.js';
import { accessthechat } from '../controllers/chat-controller.js';
const router = express.Router();

router.post('/acceschat',auth,accessthechat)

export default router;