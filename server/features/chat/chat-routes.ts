import express from 'express';
import { handleChatMessage } from './chat-controller';

const router = express.Router();

router.post('/message', handleChatMessage);

export default router; 