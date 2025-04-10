import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from './Header';
import Footer from './Footer';
import LegalContextPanel from '../legal/LegalContextPanel';
import SimpleChatInterface from '../chat/SimpleChatInterface';

const MainLayout: React.FC = () => {
  const [conversationId, setConversationId] = useState<string>();
  const [language, setLanguage] = useState('English');
  const [isMobileContextVisible, setIsMobileContextVisible] = useState(false);
  const isMobile = useIsMobile();

  // Toggle context visibility on mobile
  const toggleContext = () => {
    setIsMobileContextVisible(!isMobileContextVisible);
  };

  // Hide context panel when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileContextVisible(false);
    }
  }, [isMobile]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col space-y-4">
          <h2 className="flex items-center text-2xl font-serif text-[#14284b]">
            <svg className="w-6 h-6 mr-2 text-[#14284b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            AI Legal Assistant
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 bg-white rounded-lg shadow-sm">
            {/* Left sidebar for documents/context */}
            <div 
              className={`${
                isMobile
                  ? isMobileContextVisible 
                    ? 'block h-[60vh] z-10' 
                    : 'hidden'
                  : 'block'
              } md:w-1/4 border-r border-gray-200 p-4`}
            >
              <LegalContextPanel />
            </div>
            
            {/* Chat Interface */}
            <div 
              className={`flex-1 ${
                isMobile && isMobileContextVisible ? 'hidden' : 'block'
              }`}
            >
              <SimpleChatInterface 
                toggleContext={toggleContext}
                isMobileContextVisible={isMobileContextVisible}
                conversationId={conversationId}
                setConversationId={setConversationId}
                language={language}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;