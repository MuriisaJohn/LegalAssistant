import { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled: boolean;
}

export default function ChatInput({ onSendMessage, isDisabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleClearInput = () => {
    setMessage("");
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-gray-200 p-3 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Input
            ref={inputRef}
            type="text"
            className="w-full rounded-full pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ask a legal question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isDisabled}
          />
          {message && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              onClick={handleClearInput}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="bg-primary text-white rounded-full w-10 h-10 p-0 flex items-center justify-center hover:bg-primary-600"
          disabled={!message.trim() || isDisabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 3 3 9-3 9 19-9Z"></path>
            <path d="M13 13h9"></path>
          </svg>
        </Button>
      </form>
    </div>
  );
}
