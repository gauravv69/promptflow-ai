import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChatLayout } from '@/layouts/ChatLayout';
import { MessageList } from '@/features/chat/MessageList';
import { PromptInput } from '@/features/chat/PromptInput';
import { SavedList } from '@/features/saved/SavedList';
import { SharePage } from '@/pages/SharePage';
import { LoginPage } from '@/pages/LoginPage';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';

function App() {
  const [view, setView] = useState<'chat' | 'saved'>('chat');
  const { conversations, activeId } = useChatStore();
  const { isAuthenticated } = useAuthStore();
  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <ChatLayout setView={setView} activeView={view}>
              {view === 'chat' ? (
                <>
                  <MessageList conversation={activeConversation} />
                  <PromptInput />
                </>
              ) : (
                <div className="flex-1 overflow-hidden p-6">
                  <SavedList />
                </div>
              )}
            </ChatLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route path="/share/:id" element={<SharePage />} />
    </Routes>
  );
}

export default App;
