import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from 'multer';
import path from 'path';

// Import controllers from feature folders
import { getAllLegalContexts, getLegalContextById } from './features/legal-context/legal-context-controller';
import { getMessagesByConversationId, handleChatMessage } from './features/chat/chat-controller';
import { uploadDocument, analyzeDocument } from './features/documents/document-controller';

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes - prefix all routes with /api
  
  // Configure multer for file uploads
  const multerStorage = multer.memoryStorage();
  const upload = multer({
    storage: multerStorage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    }
  });
  
  // Legal context routes
  app.get("/api/legal-contexts", getAllLegalContexts);
  app.get("/api/legal-contexts/:id", getLegalContextById);

  // Message routes
  app.get("/api/messages/:conversationId", getMessagesByConversationId);
  
  // Document routes
  app.post("/api/documents/upload", upload.single('document'), uploadDocument);
  app.post("/api/documents/:documentId/analyze", analyzeDocument);
  
  // Chat routes
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      await handleChatMessage(req, res);
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
