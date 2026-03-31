import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChatLayout } from '@/layouts/ChatLayout';
import { MessageList } from '@/features/chat/MessageList';
import { PromptInput } from '@/features/chat/PromptInput';
import { SavedList } from '@/features/saved/SavedList';
import { SharePage } from '@/pages/SharePage';
import { useChatStore } from '@/store/useChatStore';

function App() {
  const [view, setView] = useState<'chat' | 'saved'>('chat');
  const { conversations, activeId } = useChatStore();
  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <Routes>
      <Route path="/" element={
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
      } />
      <Route path="/share/:id" element={<SharePage />} />
    </Routes>
  );
}

export default App;
