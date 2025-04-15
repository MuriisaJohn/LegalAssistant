import express from 'express';
import { handleChat, handleDocumentAnalysis } from '../controllers/chatController';

const router = express.Router();

router.post('/chat', handleChat);
router.post('/analyze', handleDocumentAnalysis);

export default router; 