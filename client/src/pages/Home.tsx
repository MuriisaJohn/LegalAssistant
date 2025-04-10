import { useState } from "react";
import Header from "@/components/Header";
import ContextPanel from "@/components/ContextPanel";
import ChatInterface from "@/components/ChatInterface";
import { Message } from "@/types";

const Home = () => {
  const [isMobileContextVisible, setIsMobileContextVisible] = useState(false);
  const [language, setLanguage] = useState("English");
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const toggleMobileContext = () => {
    setIsMobileContextVisible(!isMobileContextVisible);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header language={language} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Mobile Context Panel (only shown when toggled) */}
        {isMobileContextVisible && (
          <div className="md:hidden w-full">
            <ContextPanel />
          </div>
        )}

        {/* Desktop Context Panel (always visible on larger screens) */}
        <div className="hidden md:block md:w-1/3">
          <ContextPanel />
        </div>

        {/* Chat Interface */}
        <ChatInterface 
          toggleContext={toggleMobileContext} 
          isMobileContextVisible={isMobileContextVisible}
          conversationId={conversationId}
          setConversationId={setConversationId}
          language={language}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Ugandan Legal Assistant | Powered by AI | Not a substitute for professional legal advice
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
