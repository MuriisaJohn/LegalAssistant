import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { messageRequestSchema, messageResponseSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { generateLegalResponse } from "./openai";
import { v4 as uuidv4 } from 'uuid';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes - prefix all routes with /api
  
  // Endpoint to get all legal contexts
  app.get("/api/legal-contexts", async (_req: Request, res: Response) => {
    try {
      const contexts = await storage.getAllLegalContexts();
      return res.json(contexts);
    } catch (error) {
      console.error("Error fetching legal contexts:", error);
      return res.status(500).json({ message: "Failed to fetch legal contexts" });
    }
  });

  // Endpoint to get messages by conversation ID
  app.get("/api/messages/:conversationId", async (req: Request, res: Response) => {
    try {
      const { conversationId } = req.params;
      if (!conversationId) {
        return res.status(400).json({ message: "Conversation ID is required" });
      }
      
      const messages = await storage.getMessagesByConversationId(conversationId);
      return res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Endpoint to send a message and get a response from the AI
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      // Validate the request
      const validatedRequest = messageRequestSchema.parse(req.body);
      const { message, conversationId = uuidv4(), language = "English" } = validatedRequest;
      
      // Get legal contexts to provide to the AI
      const legalContexts = await storage.getAllLegalContexts();
      const context = legalContexts.map(ctx => `${ctx.title}: ${ctx.content}`).join("\n\n");
      
      // Store user message
      await storage.createMessage({
        role: "user",
        content: message,
        conversationId
      });
      
      // Generate AI response
      const aiResponse = await generateLegalResponse(message, context, language);
      
      // Store AI response
      const createdMessage = await storage.createMessage({
        role: "assistant",
        content: aiResponse,
        conversationId
      });
      
      // Return the response
      const response = messageResponseSchema.parse({
        message: {
          role: createdMessage.role,
          content: createdMessage.content
        },
        conversationId
      });
      
      return res.json(response);
    } catch (error) {
      console.error("Error processing chat message:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      return res.status(500).json({ message: "Failed to process your request" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
