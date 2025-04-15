import { Request, Response } from 'express';
import { getChatResponse, analyzeDocument, ChatMessage } from '../services/chatService';

export async function handleChat(req: Request, res: Response) {
  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages must be an array' });
    }

    const response = await getChatResponse(messages);
    return res.json({ response });
  } catch (error) {
    console.error('Chat controller error:', error);
    return res.status(500).json({ error: 'Failed to process chat request' });
  }
}

export async function handleDocumentAnalysis(req: Request, res: Response) {
  try {
    const { documentText } = req.body;
    
    if (!documentText || typeof documentText !== 'string') {
      return res.status(400).json({ error: 'Document text is required' });
    }

    const analysis = await analyzeDocument(documentText);
    return res.json({ analysis });
  } catch (error) {
    console.error('Document analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze document' });
  }
} 