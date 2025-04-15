import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from 'multer';
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Use Google Generative AI
import dotenv from 'dotenv';
import { storage } from './storage';
import { z } from 'zod';
import { InsertMessage } from "@shared/schema"; // Import InsertMessage type

dotenv.config();

const router = express.Router();

// Import controllers from feature folders
import { getAllLegalContexts, getLegalContextById } from './features/legal-context/legal-context-controller';
import { getMessagesByConversationId } from './features/chat/chat-controller';
import { uploadDocument, analyzeUploadedDocument } from './features/documents/document-controller';
  
  // Configure multer for file uploads
  const upload = multer({
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    }
  });

// Initialize Google Generative AI
// Using the provided key directly - **recommend moving to process.env.GOOGLE_API_KEY**
const GEMINI_API_KEY = "AIzaSyDnKE_Q4R0HbfaQSwn5MMUtibnfaMQAtIU";
if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not configured');
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Model for chat

// Message validation schema
const messageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  documentId: z.string().optional(),
  context: z.string().optional(),
  conversationId: z.string().optional().default('current') // Add conversationId
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes - prefix all routes with /api
  
  // Legal context routes
  app.get("/api/legal-contexts", getAllLegalContexts);
  app.get("/api/legal-contexts/:id", getLegalContextById);

  // Message routes
  app.get("/api/messages/:conversationId", getMessagesByConversationId);
  
  // Document routes
  app.post("/api/documents/upload", upload.single('document'), uploadDocument);
  app.post("/api/documents/analyze", upload.single('file'), analyzeUploadedDocument);
  
  // Chat routes
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      console.log('Received chat request:', req.body);
      const validatedData = messageSchema.parse(req.body);
      const { message, documentId, context, conversationId } = validatedData;

      // Get message history to determine if it's a new conversation
      const messageHistory = await storage.getMessagesByConversationId(conversationId);
      const isNewConversation = messageHistory.length === 0;

      // Handle initial greeting (no AI call)
      if (isNewConversation) {
        const simpleGreeting = "How may I help you?";
        const userMessageLower = message.toLowerCase().trim();
        const greetings = ["hi", "hello", "hey", "greetings", "hallo", "ola"]; 
        if (greetings.includes(userMessageLower)) {
          const userMsgData: InsertMessage = { role: 'user', content: message, conversationId };
          await storage.createMessage(userMsgData); 
          const assistantMsgData: InsertMessage = { role: 'assistant', content: simpleGreeting, conversationId };
          await storage.createMessage(assistantMsgData); 
          console.log(`Responding to simple greeting with: "${simpleGreeting}"`);
          return res.json({ message: simpleGreeting, greeting: "" });
        }
      }
      
      // Log user message before potentially calling AI
      const userMsgDataForAI: InsertMessage = { role: 'user', content: message, conversationId };
      await storage.createMessage(userMsgDataForAI); 

      // --- Prepare context for AI --- 
      let documentContent = '';
      if (documentId) {
        const document = await storage.getDocumentById(documentId);
        if (document) {
          documentContent = `\n\n**Document Context:**\n${document.content}\n`;
        }
      }
      const legalContexts = await storage.getAllLegalContexts();
      const combinedContext = [
        ...legalContexts.map(ctx => `**${ctx.title}:**\n${ctx.content}`),
        documentContent
      ].filter(Boolean).join('\n\n');

      // --- Construct prompt for Gemini --- 
      const systemInstruction = `You are a legal information assistant specializing in Ugandan law. Format your responses following these strict guidelines:

1.  **MODERN FORMATTING**:
    *   Use clean, readable paragraphs with proper spacing
    *   Start each major section on a new line with just the title in title case (no dashes or stars)
    *   Leave one blank line between sections
    *   Never use asterisks, dashes, or other special characters for formatting
    *   Use proper capitalization instead of symbols for emphasis
    *   Format section titles like this:
        Executive Summary
        Document Classification
        Key Points
        Legal Analysis
        Recommendations
        
2.  **TEXT PRESENTATION**:
    *   Write in clear, flowing paragraphs
    *   Use proper spacing between paragraphs for readability
    *   Indent subsections with two spaces if needed
    *   Keep text aligned consistently
    *   Use sentence case for regular text
    *   Avoid any special characters or formatting symbols

3.  **DOCUMENT STRUCTURE**:
    *   Present information in a clean, hierarchical structure
    *   Use clear titles without any decorative characters
    *   Maintain consistent spacing throughout
    *   Use natural paragraph breaks for readability
    *   Keep formatting minimal and professional

4.  **READABILITY RULES**:
    *   Ensure adequate white space between sections
    *   Use short, focused paragraphs
    *   Maintain consistent font style (no special formatting)
    *   Create clear visual hierarchy through spacing
    *   Keep line lengths comfortable for reading

5.  **DISCLAIMER PRESENTATION**:
    *   Add disclaimer as a clean paragraph at the end
    *   No special formatting or symbols
    *   Simple text: "Please note: This information is for general guidance only and should not be taken as legal advice. For advice specific to your situation, please consult a qualified legal professional."

**Current Context:**
${combinedContext || 'No specific context provided.'}`;

      const userQuery = message;
      const fullPrompt = `${systemInstruction}\n\n**User Query:**\n${userQuery}`;

      // --- Call AI --- 
      console.log('Sending request to Google Gemini API...');
      try {
        const result = await chatModel.generateContent(fullPrompt);
        const response = result.response;
        const aiResponseText = response.text();

        console.log('Received response from Google Gemini API.');

        if (!aiResponseText) {
          console.error('Invalid response structure or empty content:', response);
          throw new Error('No response content received from AI service');
        }

        // Log AI response
        const assistantMsgDataFromAI: InsertMessage = { role: 'assistant', content: aiResponseText, conversationId };
        await storage.createMessage(assistantMsgDataFromAI); 

        res.json({ message: aiResponseText, greeting: "" });
      } catch (error) {
        console.error('Google Gemini API error:', error);
        throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to get AI response', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
