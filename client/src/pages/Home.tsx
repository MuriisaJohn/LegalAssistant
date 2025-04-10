import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Disclaimer from "@/components/Disclaimer";
import ChatContainer from "@/components/Chat/ChatContainer";
import Footer from "@/components/Footer";
import ApiKeyModal from "@/components/ApiKeyModal";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [language, setLanguage] = useState<string>("English");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for API key in localStorage
    const storedApiKey = localStorage.getItem("openai_api_key");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    if (!key.trim() || !key.startsWith("sk-")) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("openai_api_key", key);
    setApiKey(key);
    setShowApiKeyModal(false);
    
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been saved successfully.",
      duration: 3000,
    });
  };

  const toggleLanguage = () => {
    const newLanguage = language === "English" ? "Luganda" : "English";
    setLanguage(newLanguage);
    
    toast({
      title: "Language Changed",
      description: `Interface language changed to ${newLanguage}`,
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header language={language} onToggleLanguage={toggleLanguage} />
      
      <main className="flex-grow overflow-hidden flex flex-col">
        <div className="container mx-auto px-4 py-4 flex-grow flex flex-col">
          <Disclaimer />
          <ChatContainer apiKey={apiKey} language={language} />
        </div>
      </main>
      
      <Footer />
      
      {showApiKeyModal && (
        <ApiKeyModal 
          onSave={handleSaveApiKey} 
          onClose={() => setShowApiKeyModal(false)} 
        />
      )}
    </div>
  );
}
