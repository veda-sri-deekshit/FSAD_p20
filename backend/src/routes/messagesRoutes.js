import express from 'express';
import {
  sendMessage,
  getMessages,
  getConversation,
  markMessageAsRead,
  getUnreadCount,
} from '../controllers/messagesController.js';

const router = express.Router();

// Messaging routes
router.post('/messages', sendMessage);
router.get('/messages', getMessages);
router.get('/messages/conversation', getConversation);
router.put('/messages/:messageId/read', markMessageAsRead);
router.get('/messages/unread/count', getUnreadCount);

export default router;
