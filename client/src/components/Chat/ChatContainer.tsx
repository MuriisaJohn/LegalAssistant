import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface ChatContainerProps {
  apiKey: string | null;
  language: string;
}

export default function ChatContainer({ apiKey, language }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get chat history from server
  const { data, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["/api/messages"],
    enabled: !!apiKey,
  });

  // Mutation for sending a message
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/messages", { 
        message, 
        language 
      });
    },
    onSuccess: async (response) => {
      const newMessage = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      scrollToBottom();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    // Add welcome message if no messages exist
    if (data && data.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Welcome to the Ugandan Legal Assistant. I'm here to help answer your legal questions based on Ugandan law documents. How can I assist you today?",
          timestamp: new Date(),
        },
      ]);
    } else if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to continue.",
        variant: "destructive",
      });
      return;
    }

    // Optimistically update UI
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    
    // Send to API
    sendMessageMutation.mutate(message);
  };

  return (
    <div className="flex-grow flex flex-col bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Chat Messages Area */}
      <div className="chat-container flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Loading indicator */}
          {sendMessageMutation.isPending && (
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 3.5c4.8.3 8.5 4 8.5 8.6 0 4.8-4.1 8.7-9.1 8.9H6.5a9 9 0 0 1-9-9.3C-2.3 6.2 2.7 1 8.5.9h6Z"></path>
                  <path d="M5.2 10h5.1a1 1 0 0 0 .7-1.7L8.5 5.7"></path>
                  <path d="M9.7 13h5.1a1 1 0 0 1 .7 1.7l-2.5 2.6"></path>
                </svg>
              </div>
              <div className="ml-2 bg-primary-50 p-3 rounded-lg flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isDisabled={sendMessageMutation.isPending || !apiKey} 
      />
    </div>
  );
}
