import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileText, X, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/types';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_MESSAGE: Message = {
  id: Date.now(),
  role: 'assistant',
  content: 'Welcome to the Legal Assistant! How may I assist you with your legal inquiry?\n\nIMPORTANT: I provide general legal information based on Ugandan law. This is not legal advice. Please consult a qualified legal professional for advice specific to your situation.',
  conversationId: 'current',
  createdAt: new Date()
};

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/api/documents/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.analysis) {
        throw new Error(response.data.error || 'No analysis received from server');
      }

      // Format the analysis text for better readability
      const formattedAnalysis = response.data.analysis
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .join('\n');

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'system',
          content: `Document "${selectedFile.name}" has been analyzed. Here's what I found:\n\n${formattedAnalysis}`,
          conversationId: 'current',
          createdAt: new Date()
        }
      ]);

      toast({
        title: "Document Analyzed",
        description: "You can now ask questions about the document",
        variant: "default"
      });
    } catch (error) {
      console.error('Error analyzing document:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to analyze document. Please try again.';
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'system',
          content: `Error analyzing document "${selectedFile.name}": ${errorMessage}. Please try again or upload a different document.`,
          conversationId: 'current',
          createdAt: new Date()
        }
      ]);

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: input,
      conversationId: 'current',
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/chat', {
        message: input,
        documentId: selectedFile?.name,
        context: 'ugandan_law'
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: response.data.message,
        conversationId: 'current',
        createdAt: new Date()
      }]);

      if (response.data.greeting && messages.length <= 1) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.greeting,
          conversationId: 'current',
          createdAt: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h2 className="text-2xl font-serif font-medium text-[#14284b]">Legal Assistant</h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedFile
            ? "Ask questions about your uploaded document in the context of Ugandan law"
            : "Ask general questions about Ugandan law or upload a document for specific analysis"}
        </p>
      </div>

      {/* Document Upload Section */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
          
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg"
              >
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {selectedFile && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  onClick={handleFileUpload}
                  className="bg-[#14284b] hover:bg-[#0f203a] text-white"
                >
                  Analyze Document
                </Button>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <Loader2 className="h-4 w-4 animate-spin text-[#14284b]" />
                <span className="text-sm text-gray-600">Analyzing document...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 py-12"
            >
              <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-4">Welcome to the Legal Assistant!</p>
              <div className="max-w-md mx-auto space-y-4">
                <p>You can:</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#14284b]" />
                    <span>Ask general questions about Ugandan law</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#14284b]" />
                    <span>Upload a document for specific analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#14284b]" />
                    <span>Get legal advice on various topics</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "flex items-start space-x-2 max-w-[80%]",
              message.role === 'user' && "flex-row-reverse space-x-reverse"
            )}>
              <div className={cn(
                "p-1.5 rounded-full",
                message.role === 'user' ? "bg-[#14284b]" : "bg-gray-200"
              )}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-gray-700" />
                )}
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-2",
                message.role === 'user'
                  ? "bg-[#14284b] text-white"
                  : message.role === 'system'
                  ? "bg-blue-50 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              )}>
                {message.content}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-white border-t px-6 py-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedFile
                ? "Ask a question about the document in the context of Ugandan law..."
                : "Ask a question about Ugandan law..."
            }
            className="flex-1 min-h-[60px] max-h-[120px] resize-none rounded-xl border-gray-200 focus:border-[#14284b] focus:ring-1 focus:ring-[#14284b]"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "h-[60px] px-6 rounded-xl transition-all duration-200",
              isLoading
                ? "bg-gray-100 text-gray-400"
                : "bg-[#14284b] hover:bg-[#0f203a] text-white"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;