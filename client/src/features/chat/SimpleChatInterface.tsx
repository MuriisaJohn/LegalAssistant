import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message, MessageResponse } from '@/types';
import { ChevronDown, Send, User, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  toggleContext: () => void;
  isMobileContextVisible: boolean;
  conversationId?: string;
  setConversationId: (id: string) => void;
  language: string;
}

const SimpleChatInterface: React.FC<ChatInterfaceProps> = ({
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
      role: 'assistant' as 'assistant',
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Header with Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex px-4 py-3 space-x-4">
          <div className="text-gray-500 px-3 py-1 border-b-2 border-primary text-primary font-medium text-sm cursor-pointer">
            Chat
          </div>
          <div className="text-gray-500 px-3 py-1 text-sm cursor-pointer hover:text-gray-700">
            Document Info
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6" style={{ height: 'calc(100vh - 13rem)' }}>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          displayMessages.map((message, index) => (
            <div 
              key={index}
              className="mb-6"
            >
              <div className="flex items-start">
                {message.role === 'assistant' && (
                  <div className="text-xs text-gray-500 mb-1 ml-12">
                    {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                )}
              </div>
              
              <div className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-[#14284b] text-white flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                
                <div 
                  className={`${
                    message.role === 'user' 
                      ? 'bg-[#14284b] text-white rounded-lg max-w-[60%] ml-auto' 
                      : 'bg-white text-gray-800 rounded-lg shadow-sm border border-gray-200 max-w-[75%]'
                  } p-4`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.role === 'assistant' && message.content.includes("References:") 
                      ? message.content.split("References:")[0].trim() 
                      : message.content}
                  </p>
                  
                  {message.role === 'assistant' && message.content.includes("References:") && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs font-medium text-primary">Referenced Articles</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {message.content.split("References:").pop()?.trim()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="flex justify-end">
                  <div className="text-xs text-gray-500 mt-1 mr-2">
                    {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (inputMessage.trim()) {
            handleSendMessage(inputMessage);
            setInputMessage('');
          }
        }} className="flex items-center space-x-3 relative">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 border border-gray-300 bg-white rounded-md py-2 pl-4 pr-10 focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50"
            placeholder="Ask a legal question..."
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            type="submit" 
            className="bg-[#14284b] hover:bg-[#0f203a] text-white rounded-md p-2 h-auto w-auto absolute right-1 top-1/2 transform -translate-y-1/2"
            disabled={sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      {/* Mobile Context Toggle */}
      <div className="md:hidden border-t border-gray-200 p-2 bg-white">
        <button 
          onClick={toggleContext}
          className="w-full py-2 text-sm font-medium text-center text-gray-600 hover:text-[#14284b] transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{isMobileContextVisible ? "Hide Documents" : "Show Documents"}</span>
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isMobileContextVisible ? 'transform rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default SimpleChatInterface;