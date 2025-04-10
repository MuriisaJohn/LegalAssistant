import { MessageResponse } from "@/types";
import { apiRequest } from "./queryClient";

/**
 * Send a message to the OpenAI API through our backend
 * 
 * @param message The user's message
 * @param conversationId Optional conversation ID for context
 * @param language The language to respond in
 * @returns A promise that resolves to the API response
 */
export async function sendMessage(
  message: string,
  conversationId?: string,
  language: string = "English"
): Promise<MessageResponse> {
  try {
    const response = await apiRequest("POST", "/api/chat", {
      message,
      conversationId,
      language
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}
