import { Configuration } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not set in environment variables');
}

export const openRouterConfig = new Configuration({
  apiKey: process.env.OPENROUTER_API_KEY,
  basePath: 'https://openrouter.ai/api/v1',
  baseOptions: {
    headers: {
      'HTTP-Referer': 'https://github.com/yourusername/legal-assistant', // Update this with your actual repository
      'X-Title': 'Legal Assistant'
    }
  }
});

// Default model configuration
export const defaultModel = 'openai/gpt-4-turbo-preview';

// Model configuration for different tasks
export const modelConfig = {
  chat: defaultModel,
  analysis: defaultModel,
  summary: defaultModel
};

// Export other configurations as needed
export const maxTokens = 4000;
export const temperature = 0.7; 