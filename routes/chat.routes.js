import express from 'express';
import auth from '../middleware/auth.js';
import { accessthechat, createGroupChat, fetchChat, groupAddMember, groupRemoveMember, renameGroup } from '../controllers/chat-controller.js';
const router = express.Router();

router.post('/acceschat',auth,accessthechat)
router.get('/fetchchat',auth,fetchChat)
router.post('/creategroupchat',auth,createGroupChat)
router.put('/renamegroup',auth,renameGroup)
router.put('/groupadd',auth,groupAddMember)
router.put('/groupremove',auth,groupRemoveMember)
export default router;