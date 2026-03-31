import { Share2, Check, ExternalLink } from 'lucide-react';
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
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-10 w-full overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center font-black italic text-blue-500 shadow-inner">
          PF
        </div>
        <div>
          <h1 className="text-sm font-black italic uppercase tracking-tighter text-white leading-none mb-1">
            {conversation.title}
          </h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold flex items-center gap-1">
            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            Active Session
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleShare}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold uppercase tracking-widest text-[10px] border active:scale-95",
            isCopied 
              ? "bg-green-600/10 border-green-500/30 text-green-400" 
              : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
          )}
        >
          {isCopied ? (
            <>
              <Check size={14} />
              Link Copied
            </>
          ) : (
            <>
              <Share2 size={14} />
              Share Chat
            </>
          )}
        </button>
      </div>
    </header>
  );
};
