import { apiRequest } from "@/lib/queryClient";

/**
 * Interface for chat messages
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Function to get a legal response from the OpenAI API via our backend
 * @param message The user's message
 * @param context Optional context to include with the message
 * @param language The language for the response
 * @returns A promise that resolves to the API response
 */
export async function getLegalResponse(
  message: string,
  language: string = "English",
  context?: string
): Promise<Response> {
  return apiRequest("POST", "/api/openai/legal-advice", {
    message,
    language,
    context
  });
}

/**
 * Function to translate text using OpenAI
 * @param text The text to translate
 * @param targetLanguage The target language
 * @returns A promise that resolves to the translated text
 */
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<Response> {
  return apiRequest("POST", "/api/openai/translate", {
    text,
    targetLanguage
  });
}
