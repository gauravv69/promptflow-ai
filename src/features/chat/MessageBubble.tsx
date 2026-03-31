import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Bookmark, Check } from 'lucide-react';
import { useState } from 'react';
import { useSavedStore } from '@/store/useSavedStore';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp?: number;
}

export const MessageBubble = ({ content, sender, timestamp }: MessageBubbleProps) => {
  const isAssistant = sender === 'assistant';
  const saveItem = useSavedStore((state) => state.saveItem);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (isSaved) return;
    saveItem(content, isAssistant ? 'response' : 'prompt');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Visual feedback duration
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-6 last:mb-0 transition-all group",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      <div className={cn(
        "max-w-2xl px-6 py-4 rounded-3xl text-sm leading-relaxed tracking-tight relative",
        isAssistant 
          ? "bg-neutral-800 text-neutral-100 border border-neutral-700/50 shadow-xl shadow-neutral-950/20" 
          : "bg-blue-600 text-white shadow-xl shadow-blue-600/30"
      )}>
        <p className="whitespace-pre-wrap">
          {content || (isAssistant && <span className="inline-block w-4 h-4 rounded-full bg-blue-400 animate-pulse" />)}
        </p>

        <button 
          onClick={handleSave}
          className={cn(
            "absolute -right-12 top-2 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100 bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-blue-400 hover:scale-110 active:scale-95",
            isAssistant ? "-right-12" : "-left-12",
            isSaved && "text-green-400 border-green-900/30"
          )}
        >
          {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
        </button>
        
        {timestamp && (
          <div className={cn(
            "text-[9px] mt-2 opacity-30 font-bold uppercase tracking-widest",
            isAssistant ? "text-neutral-400" : "text-blue-200"
          )}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
