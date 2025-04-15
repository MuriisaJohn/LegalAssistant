import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../storage';
import { generateLegalResponse } from './openai-service';
import { MessageRequest, MessageResponse } from '../../../shared/schema';
import { z } from 'zod';

// Validation schema for chat messages
const messageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversationId: z.string().optional(),
  documentId: z.string().optional(),
  language: z.string().default('English'),
  context: z.string().optional()
});

/**
 * Handles retrieving all messages for a specific conversation
 */
export async function getMessagesByConversationId(req: Request, res: Response) {
  try {
    const { conversationId } = req.params;
    
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    const messages = await storage.getMessagesByConversationId(conversationId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

/**
 * Handles the chat request and generates a response using the OpenAI API
 */
export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await generateLegalResponse(message, context);
    
    return res.json({
      message: response,
      success: true
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      success: false
    });
  }
}