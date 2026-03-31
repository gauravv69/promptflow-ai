import { ChatLayout } from '@/layouts/ChatLayout';
import { MessageBubble } from '@/features/chat/MessageBubble';
import { PromptInput } from '@/features/chat/PromptInput';

function App() {
  return (
    <ChatLayout>
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <MessageBubble 
            sender="assistant" 
            content="Welcome to PromptFlow AI! How can I assist you with your SaaS project today?" 
            timestamp="JUST NOW"
          />
          <MessageBubble 
            sender="user" 
            content="Hi, I need help setting up a scalable React application using Tailwind CSS v3." 
            timestamp="1 MIN AGO"
          />
          <MessageBubble 
            sender="assistant" 
            content="Perfect choice! I've already initialized your project with Tailwind v3, PostCSS, and a robust folder structure. Your setup is now production-ready with absolute imports and a dark theme by default." 
            timestamp="NOW"
          />
        </div>
      </div>
      <PromptInput />
    </ChatLayout>
  );
}

export default App;
