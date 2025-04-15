import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import MainLayout from "./features/layout/MainLayout";
import About from "@/pages/About";
import ChatPanel from "@/features/chat/ChatPanel";

function ChatPage() {
  return (
    <MainLayout>
      <ChatPanel />
    </MainLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainLayout} />
      <Route path="/about" component={About} />
      <Route path="/chat" component={ChatPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
