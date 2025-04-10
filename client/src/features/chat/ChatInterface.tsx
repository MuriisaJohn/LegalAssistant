import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message, MessageResponse } from '@/types';
import { ChevronDown, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Disclaimer component
const Disclaimer = () => (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-amber-700">
          <strong>Disclaimer:</strong> This AI assistant provides general legal information based on Ugandan law, not personalized legal advice. Always consult with a qualified attorney for your specific situation.
        </p>
      </div>
    </div>
  </div>
);

interface ChatInterfaceProps {
  toggleContext: () => void;
  isMobileContextVisible: boolean;
  conversationId?: string;
  setConversationId: (id: string) => void;
  language: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  toggleContext,
  isMobileContextVisible,
  conversationId,
  setConversationId,
  language
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState('');

  // Fetch messages if we have a conversation ID
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages', conversationId],
    enabled: !!conversationId,
  });

  // Add initial welcome message if no messages exist
  const displayMessages = messages.length > 0 ? messages : [
    {
      id: 0,
      role: 'assistant',
      content: "Welcome! I'm your Ugandan legal assistant. How can I help you with your legal questions today?",
      conversationId: conversationId || '',
      createdAt: new Date()
    }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        message,
        conversationId,
        language
      });
      const data: MessageResponse = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Save the conversation ID if this is a new conversation
      if (!conversationId) {
        setConversationId(data.conversationId);
      }
      
      // Invalidate the cache to refetch messages
      queryClient.invalidateQueries({ queryKey: ['/api/messages', data.conversationId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      console.error("Error sending message:", error);
    }
  });

  const handleSendMessage = (message: string) => {
    if (!message.trim()) {
      return;
    }
    
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Legal Disclaimer Banner */}
      <Disclaimer />
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 chat-container" style={{ height: 'calc(100vh - 13rem)' }}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          displayMessages.map((message, index) => (
            <div 
              key={index}
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
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (inputMessage.trim()) {
            handleSendMessage(inputMessage);
            setInputMessage('');
          }
        }} className="flex items-center space-x-2">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Type your legal question..."
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>

      {/* Mobile Context Toggle */}
      <div className="md:hidden border-t border-gray-200 p-2 bg-gray-50">
        <button 
          onClick={toggleContext}
          className="w-full text-sm text-center text-gray-500 hover:text-gray-700 flex items-center justify-center"
        >
          <span>{isMobileContextVisible ? "Hide Legal Context" : "Show Legal Context"}</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;