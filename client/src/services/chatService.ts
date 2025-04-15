import { Message } from '@/types';

export const sendMessage = async (message: string): Promise<Message> => {
  try {
    console.log('Sending message to API:', message);
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message,
        context: 'ugandan_law'
      }),
    });

    console.log('API Response status:', response.status);
    const data = await response.json();
    console.log('API Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }

    return {
      id: Date.now(),
      content: data.message,
      role: 'assistant',
      conversationId: data.conversationId || 'current',
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}; 