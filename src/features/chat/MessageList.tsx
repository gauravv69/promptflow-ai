import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatHeader } from './ChatHeader';
import type { Conversation } from '@/types/chat';

interface MessageListProps {
  conversation: Conversation | undefined;
}

export const MessageList = ({ conversation }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation?.messages]);

  if (!conversation || conversation.messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
        <div className="w-16 h-16 mb-4 bg-neutral-800 rounded-2xl flex items-center justify-center animate-pulse border border-neutral-700">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">P</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-2">How can I help you today?</h2>
        <p className="max-w-md text-sm text-neutral-400">
          Start a new conversation with PromptFlow AI. I can assist with writing code, architecture design, 
          and general SaaS workflows.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader conversation={conversation} />
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar"
      >
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          {conversation.messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              sender={message.role}
              timestamp={message.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
