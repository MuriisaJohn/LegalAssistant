import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../../storage';
import { generateLegalResponse } from './openai-service';
import { MessageRequest, MessageResponse } from '../../../shared/schema';

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
    const { message, conversationId: existingConversationId, language = 'English' } = req.body as MessageRequest;
    
    // Generate a new conversation ID if none exists
    const conversationId = existingConversationId || uuidv4();
    
    // Get all legal contexts to provide as context for the AI
    const legalContexts = await storage.getAllLegalContexts();
    const combinedContext = legalContexts.map(ctx => `${ctx.title}:\n${ctx.content}`).join('\n\n');
    
    // Create user message
    const userMessage = {
      role: 'user',
      content: message,
      conversationId,
      createdAt: new Date()
    };
    
    // Save user message to storage
    await storage.createMessage(userMessage);
    
    // Generate AI response
    const aiResponseContent = await generateLegalResponse(message, combinedContext, language);
    
    // Create AI message
    const aiMessage = {
      role: 'assistant',
      content: aiResponseContent,
      conversationId,
      createdAt: new Date()
    };
    
    // Save AI message to storage
    await storage.createMessage(aiMessage);
    
    // Format response
    const response: MessageResponse = {
      message: {
        role: 'assistant',
        content: aiResponseContent
      },
      conversationId
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ error: 'Failed to generate chat response' });
  }
}