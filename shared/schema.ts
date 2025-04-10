import { pgTable, text, serial, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Role enum for message sender (user or assistant)
export const roleEnum = pgEnum("role", ["user", "assistant"]);

// Message model for chat history
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: roleEnum("role").notNull(),
  content: text("content").notNull(),
  language: text("language").notNull().default("English"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schema for messages
export const insertMessageSchema = createInsertSchema(messages).pick({
  role: true,
  content: true,
  language: true,
});

// Legacy user schema maintained for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
