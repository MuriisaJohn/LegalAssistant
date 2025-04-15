import { OpenAIApi } from 'openai';
import { openRouterConfig, modelConfig, maxTokens, temperature } from '../config';

const openRouter = new OpenAIApi(openRouterConfig);

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await openRouter.createChatCompletion({
      model: modelConfig.chat,
      messages,
      max_tokens: maxTokens,
      temperature: temperature,
    });

    if (!response.data.choices[0]?.message?.content) {
      throw new Error('No response content received from API');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat service:', error);
    throw error;
  }
}

export async function analyzeDocument(documentText: string): Promise<string> {
  try {
    const systemPrompt = `You are a legal document analyzer. Analyze the following document and provide a detailed breakdown of its key points, legal implications, and any potential issues or concerns. Format your response in a clear, structured manner.`;
    
    const response = await openRouter.createChatCompletion({
      model: modelConfig.analysis,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: documentText }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    if (!response.data.choices[0]?.message?.content) {
      throw new Error('No analysis content received from API');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in document analysis:', error);
    throw error;
  }
} 