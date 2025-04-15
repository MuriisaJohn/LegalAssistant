import { Express } from 'express';
import http from 'http';
import chatRouter from './chat';

export async function registerRoutes(app: Express): Promise<http.Server> {
  const server = http.createServer(app);
  
  // Register routes
  app.use(chatRouter);

  return server;
} 