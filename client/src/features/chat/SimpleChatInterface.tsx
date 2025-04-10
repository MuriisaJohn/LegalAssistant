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
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Legal Disclaimer Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 p-4 shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-amber-800">
              <strong>Legal Disclaimer:</strong> This AI assistant provides general legal information based on Ugandan law, not personalized legal advice. Always consult with a qualified attorney for your specific situation.
            </p>
          </div>
        </div>
      </div>
      
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
                    ? 'user-message bg-gradient-to-br from-primary to-primary-dark text-white rounded-[1.25rem_1.25rem_0.25rem_1.25rem] shadow-md' 
                    : 'assistant-message bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 rounded-[1.25rem_1.25rem_1.25rem_0.25rem] shadow-sm font-serif border border-gray-200'
                } p-4 max-w-[80%]`}
              >
                <p className="whitespace-pre-wrap">
                  {message.role === 'assistant' && message.content.includes("References:") 
                    ? message.content.split("References:")[0].trim() 
                    : message.content}
                </p>
                {message.role === 'assistant' && (
                  <div>
                    {/* Extract and format references if they exist */}
                    {message.content.includes("References:") ? (
                      <>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                            </svg>
                            <span className="text-xs font-medium text-primary">Legal References</span>
                          </div>
                          <div className="text-xs text-gray-600 pl-5">
                            {message.content.split("References:").pop()?.trim()}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 text-xs text-gray-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                        </svg>
                        <span>Based on Ugandan legal documents</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-5 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-3xl mx-auto">
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
              className="flex-1 border border-gray-300 bg-white rounded-full px-5 py-3 pr-12 text-base shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
              placeholder="Ask any legal question about Ugandan law..."
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 text-white rounded-full p-3 h-auto w-auto shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary absolute right-1 top-1/2 transform -translate-y-1/2"
              disabled={sendMessageMutation.isPending}
            >
              {sendMessageMutation.isPending ? (
                <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-white rounded-full" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>

          <div className="text-xs text-center text-gray-500 mt-2">
            Your questions will be answered based on Ugandan legal reference documents
          </div>
        </div>
      </div>

      {/* Mobile Context Toggle */}
      <div className="md:hidden border-t border-gray-200 p-2 bg-gray-50">
        <button 
          onClick={toggleContext}
          className="w-full py-2 text-sm font-medium text-center text-primary hover:text-primary-dark transition-colors flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          <span>{isMobileContextVisible ? "Hide Legal References" : "Show Legal References"}</span>
          <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isMobileContextVisible ? 'transform rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default SimpleChatInterface;