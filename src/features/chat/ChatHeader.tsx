import { Share2, Check, Zap, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useSharedStore } from '@/store/useSharedStore';
import type { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  conversation: Conversation | undefined;
}

export const ChatHeader = ({ conversation }: ChatHeaderProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { shareConversation } = useSharedStore();

  if (!conversation) return null;

  const handleShare = () => {
    const shareId = shareConversation(conversation);
    const url = `${window.location.origin}/share/${shareId}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-2xl sticky top-0 z-20 w-full overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex w-10 h-10 bg-gradient-to-br from-neutral-800 to-black border border-white/10 rounded-xl items-center justify-center shadow-2xl">
          <Zap size={18} className="text-blue-500 fill-blue-500/20" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-sm font-black tracking-tight text-white line-clamp-1">
              {conversation.title}
            </h1>
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <ShieldCheck size={10} className="text-blue-500" />
              <span className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Encrypted</span>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            Active Session
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleShare}
          className={cn(
            "group flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] border active:scale-95",
            isCopied 
              ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
              : "bg-white/5 border-white/5 text-neutral-400 hover:text-white hover:border-white/20 hover:bg-white/10"
          )}
        >
          {isCopied ? (
            <>
              <Check size={14} className="animate-in" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 size={14} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Share Session</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
