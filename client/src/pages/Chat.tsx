import React from 'react';
import MainLayout from '@/features/layout/MainLayout';
import ChatPanel from '@/features/chat/ChatPanel';

const Chat: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <ChatPanel />
      </div>
    </MainLayout>
  );
};

export default Chat; 