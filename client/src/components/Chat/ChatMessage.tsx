import { FC } from "react";

interface MessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  };
}

const ChatMessage: FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  
  // Convert markdown-like formatting to HTML
  const formatMessage = (content: string) => {
    // This is a simple implementation; consider using a proper markdown parser in production
    let formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n([0-9]+\.\s)/g, '</p><p>$1')
      .replace(/\n-\s/g, '</p><p>- ')
      .replace(/\n/g, '<br />');
    
    // Convert lists
    if (formattedContent.includes('</p><p>1. ')) {
      formattedContent = formattedContent.replace(/<p>([0-9]+\.\s.*?)<\/p>/g, '<li>$1</li>');
      formattedContent = formattedContent.replace(/<li>1\.\s/, '<ol><li>');
      formattedContent += '</ol>';
    }
    
    // Convert bullet points
    if (formattedContent.includes('</p><p>- ')) {
      formattedContent = formattedContent.replace(/<p>-\s(.*?)<\/p>/g, '<li>$1</li>');
      formattedContent = formattedContent.replace(/<li>/, '<ul><li>');
      formattedContent += '</ul>';
    }
    
    return `<p>${formattedContent}</p>`;
  };

  return (
    <div className={`flex items-start ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 3.5c4.8.3 8.5 4 8.5 8.6 0 4.8-4.1 8.7-9.1 8.9H6.5a9 9 0 0 1-9-9.3C-2.3 6.2 2.7 1 8.5.9h6Z"></path>
            <path d="M5.2 10h5.1a1 1 0 0 0 .7-1.7L8.5 5.7"></path>
            <path d="M9.7 13h5.1a1 1 0 0 1 .7 1.7l-2.5 2.6"></path>
          </svg>
        </div>
      )}
      
      <div 
        className={`${isUser ? "message-user bg-primary text-white" : "ml-2 message-bot bg-primary-50 text-dark"} p-3 rounded-lg max-w-[85%]`}
        style={{
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
        }}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} 
          className={`prose ${isUser ? "prose-invert" : ""} prose-sm max-w-none`}
        />
      </div>
      
      {isUser && (
        <div className="ml-2 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
