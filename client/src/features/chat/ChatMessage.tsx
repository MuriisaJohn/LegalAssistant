import React from 'react';
import { User } from 'lucide-react';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div 
      className={`flex ${message.role === 'user' ? 'flex-row-reverse' : ''} items-start mb-4`}
    >
      <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
        <div 
          className={`h-8 w-8 rounded-full flex items-center justify-center ${
            message.role === 'user' ? 'bg-gray-300' : 'bg-primary text-white'
          }`}
        >
          <User className="h-5 w-5" />
        </div>
      </div>
      <div 
        className={`${
          message.role === 'user' 
            ? 'user-message bg-primary text-white rounded-[1rem_1rem_0_1rem]' 
            : 'assistant-message bg-gray-100 text-gray-800 rounded-[1rem_1rem_1rem_0] font-serif'
        } p-3 max-w-[80%]`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;