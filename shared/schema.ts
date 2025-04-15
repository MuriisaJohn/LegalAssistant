import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Message schema
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // 'user', 'assistant', or 'system'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  conversationId: text("conversation_id").notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  role: true,
  content: true,
  conversationId: true,
});

// Legal context schema
export const legalContexts = pgTable("legal_contexts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  title: text("title").notNull(),
});

export const insertLegalContextSchema = createInsertSchema(legalContexts).pick({
  content: true,
  title: true,
});

// Document schema
export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  analysis: text("analysis"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  name: true,
  content: true,
  type: true,
  size: true,
  analysis: true,
});

// Define types for our schemas
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertLegalContext = z.infer<typeof insertLegalContextSchema>;
export type LegalContext = typeof legalContexts.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Define message request and response schemas for API
export const messageRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().optional(),
  language: z.string().default("English")
});

export type MessageRequest = z.infer<typeof messageRequestSchema>;

export const messageResponseSchema = z.object({
  message: z.object({
    role: z.string(),
    content: z.string()
  }),
  conversationId: z.string()
});

export type MessageResponse = z.infer<typeof messageResponseSchema>;
