import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isDisabled }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) {
      return;
    }
    
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Type your legal question..."
          disabled={isDisabled}
        />
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-dark text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={isDisabled}
        >
          {isDisabled ? (
            <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;