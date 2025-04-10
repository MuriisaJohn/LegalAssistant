import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { openai } from "./lib/openai";
import { z } from "zod";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  
  // Get all messages (chat history)
  app.get("/api/messages", async (req: Request, res: Response) => {
    try {
      const messages = await storage.getAllMessages();
      
      // Transform for client use
      const clientMessages = messages.map(msg => ({
        id: msg.id.toString(),
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt
      }));
      
      return res.json(clientMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a new message and get AI response
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const { message, language = "English" } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Save user message
      const userMessage = await storage.createMessage({
        role: "user",
        content: message,
        language
      });

      // Get OpenAI response
      const response = await openai.generateLegalResponse(message, language);
      
      // Save assistant message
      const assistantMessage = await storage.createMessage({
        role: "assistant",
        content: response,
        language
      });

      // Return both messages
      return res.status(201).json({
        id: assistantMessage.id.toString(),
        role: assistantMessage.role,
        content: assistantMessage.content,
        timestamp: assistantMessage.createdAt
      });
    } catch (error) {
      console.error("Error processing message:", error);
      return res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Direct OpenAI endpoints
  app.post("/api/openai/legal-advice", async (req: Request, res: Response) => {
    try {
      const { message, language = "English", context } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const response = await openai.generateLegalResponse(message, language, context);
      return res.json({ response });
    } catch (error) {
      console.error("Error getting legal advice:", error);
      return res.status(500).json({ message: "Failed to get legal advice" });
    }
  });

  app.post("/api/openai/translate", async (req: Request, res: Response) => {
    try {
      const { text, targetLanguage } = req.body;
      
      if (!text || !targetLanguage) {
        return res.status(400).json({ message: "Text and target language are required" });
      }

      const translatedText = await openai.translateText(text, targetLanguage);
      return res.json({ translatedText });
    } catch (error) {
      console.error("Error translating text:", error);
      return res.status(500).json({ message: "Failed to translate text" });
    }
  });

  // Clear chat history
  app.delete("/api/messages", async (req: Request, res: Response) => {
    try {
      await storage.clearMessages();
      return res.json({ message: "Chat history cleared successfully" });
    } catch (error) {
      console.error("Error clearing messages:", error);
      return res.status(500).json({ message: "Failed to clear chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
