import express from 'express';
import { handleChatMessage } from '../features/chat/chat-controller';

const router = express.Router();

router.post('/api/chat', handleChatMessage);

export default router; 