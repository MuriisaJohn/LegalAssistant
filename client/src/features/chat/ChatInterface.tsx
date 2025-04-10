import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message, MessageResponse } from '@/types';
import { ChevronDown, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Use destructured imports instead of default imports due to project structure
import { default as ChatMessage } from './ChatMessage';
import { default as ChatInput } from './ChatInput';
import { default as Disclaimer } from './Disclaimer';

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
            <ChatMessage key={index} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isDisabled={sendMessageMutation.isPending} 
      />

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