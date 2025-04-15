import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import ChatPanel from "@/features/chat/ChatPanel";
import MainLayout from "./features/layout/MainLayout";
import { useState, useCallback } from "react";

function ChatPage() {
  return (
    <MainLayout>
      <ChatPanel />
    </MainLayout>
  );
}

const useBasePath = () => {
  const [location, setLocation] = useState(() => {
    const path = window.location.pathname;
    return path === '/LegalAssistant' || path === '/LegalAssistant/' ? '/' : path.replace('/LegalAssistant', '');
  });
  
  const navigate = useCallback((to: string) => {
    const newPath = '/LegalAssistant' + (to.startsWith('/') ? to : '/' + to);
    window.history.pushState(null, '', newPath);
    setLocation(to);
  }, []);
  
  return [location, navigate] as [string, (to: string) => void];
};

function Router() {
  return (
    <WouterRouter hook={useBasePath}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/chat" component={ChatPage} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
