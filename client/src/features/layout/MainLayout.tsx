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
    <div className="flex flex-col min-h-screen">
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-13rem)]">
          {/* Legal Context Panel - Hidden on mobile unless toggled */}
          <div 
            className={`${
              isMobile
                ? isMobileContextVisible 
                  ? 'block h-[60vh] z-10' 
                  : 'hidden'
                : 'block'
            } md:w-1/3 lg:w-1/4`}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;