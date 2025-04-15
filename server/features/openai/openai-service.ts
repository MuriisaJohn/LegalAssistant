import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://legal-assistant.com',
    'X-Title': 'Legal Assistant'
  }
});

export async function generateLegalResponse(message: string, context?: string) {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: 'You are a helpful legal assistant. Provide clear, accurate legal information and guidance.'
      }
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `Context: ${context}`
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating legal response:', error);
    throw error;
  }
} 