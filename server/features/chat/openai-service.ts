import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://legal-assistant.com',
    'X-Title': 'Legal Assistant'
  }
});

/**
 * Generates a legal response based on the provided user message, legal context, and language.
 * 
 * @param message The user's question
 * @param context Legal context information to inform the AI's response
 * @param language The language to respond in (defaults to English)
 * @returns A string containing the AI's response
 */
export async function generateLegalResponse(
  message: string,
  context: string,
  language: string = "English"
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful legal assistant. Provide clear, accurate legal information while noting that you're not providing legal advice.${
      context ? `\n\nContext: ${context}` : ''
    }`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error generating legal response:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Translates text to the specified language
 * 
 * @param text The text to translate
 * @param targetLanguage The target language
 * @returns The translated text
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not set");
    }

    const prompt = `
Translate the following text to ${targetLanguage}:

Text:
${text}

Translation:
    `;

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-v3-base:free",
      messages: [
        { role: "system", content: `You are a professional translator to ${targetLanguage}.` },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Translation error";
  } catch (error) {
    console.error("OpenAI API error during translation:", error);
    return text; // Return original text if translation fails
  }
}