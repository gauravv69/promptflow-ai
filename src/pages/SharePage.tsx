import { useParams, Link } from 'react-router-dom';
import { useSharedStore } from '@/store/useSharedStore';
import { MessageBubble } from '@/features/chat/MessageBubble';
import { Layers, MessageSquare, ArrowRight } from 'lucide-react';

export const SharePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getSharedConversation } = useSharedStore();
  const conversation = id ? getSharedConversation(id) : undefined;

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-6">
        <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-3xl text-center space-y-4 max-w-md animate-in fade-in zoom-in duration-500">
          <div className="inline-flex p-4 bg-red-950/20 text-red-500 border border-red-900/30 rounded-2xl mb-2">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Shared Chat Not Found</h1>
          <p className="text-neutral-500 text-sm leading-relaxed">
            This link may have expired or was never created. Make sure you have the correct URL.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
          >
            Go to PromptFlow AI
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col p-4 md:p-8">
      {/* Shared Header */}
      <div className="max-w-4xl mx-auto w-full mb-8 flex justify-between items-center bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 text-blue-500 border border-blue-600/20 rounded-xl">
            <Layers size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black italic uppercase tracking-tight text-white leading-none mb-1">Shared: {conversation.title}</h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Read-only Conversation</p>
          </div>
        </div>
        <Link 
          to="/" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-blue-900/20"
        >
          Open in App
        </Link>
      </div>

      {/* Messages */}
      <div className="max-w-3xl mx-auto w-full flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {conversation.messages.length === 0 ? (
          <div className="text-center text-neutral-600 py-12 uppercase tracking-widest text-[10px] font-bold italic opacity-30">
            No messages in this shared chat.
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <MessageBubble 
              key={msg.id}
              content={msg.content}
              sender={msg.role}
              timestamp={msg.createdAt}
            />
          ))
        )}
      </div>

      {/* Shared Footer Indicator */}
      <div className="max-w-4xl mx-auto w-full mt-8 text-center text-[10px] text-neutral-600 uppercase tracking-[0.2em] font-black italic opacity-20">
        Generated with PromptFlow AI • {new Date(conversation.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
