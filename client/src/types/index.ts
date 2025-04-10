// Message types
export interface Message {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  conversationId: string;
  createdAt: Date;
}

export interface MessageRequest {
  message: string;
  conversationId?: string;
  language?: string;
}

export interface MessageResponse {
  message: {
    role: string;
    content: string;
  };
  conversationId: string;
}

// Legal context
export interface LegalContext {
  id: number;
  title: string;
  content: string;
}
