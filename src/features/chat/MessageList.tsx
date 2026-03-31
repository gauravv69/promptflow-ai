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
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 animate-in">
          <div className="w-24 h-24 mb-8 mx-auto relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20 blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-110">
              <span className="text-4xl font-black text-white tracking-widest italic">P</span>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            Engineered for Precision.
          </h2>
          <p className="max-w-md mx-auto text-sm md:text-base text-neutral-500 font-medium leading-relaxed mb-8">
            Experience the next generation of AI control. Your journey starts with a single prompt.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2">
            {['Code Architect', 'Data Analyst', 'Creative Engine'].map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full glass border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
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
