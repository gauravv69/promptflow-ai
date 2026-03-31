import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Bookmark, Check, User, Bot, Copy } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (isSaved) return;
    saveItem(content, isAssistant ? 'response' : 'prompt');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "flex w-full mb-8 last:mb-0 items-start gap-4 group",
        isAssistant ? "justify-start" : "justify-end flex-row-reverse"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
        isAssistant 
          ? "bg-white/5 border-white/10 text-blue-400" 
          : "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
      )}>
        {isAssistant ? <Bot size={16} /> : <User size={16} />}
      </div>

      <div className={cn(
        "flex flex-col gap-2 max-w-[85%] md:max-w-2xl",
        isAssistant ? "items-start" : "items-end"
      )}>
        <div className={cn(
          "px-6 py-4 rounded-[2rem] text-sm md:text-base leading-relaxed relative transition-all duration-300",
          isAssistant 
            ? "glass text-neutral-200 rounded-tl-none border-white/5" 
            : "bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-tr-none shadow-2xl shadow-blue-600/10"
        )}>
          <p className="whitespace-pre-wrap font-medium">
            {content || (isAssistant && (
              <span className="flex gap-1.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-bounce" />
              </span>
            ))}
          </p>
          
          {/* Action Bar */}
          <div className={cn(
            "absolute flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform",
            isAssistant ? "-right-2 translate-x-full top-0" : "-left-2 -translate-x-full top-0"
          )}>
            <button 
              onClick={handleCopy}
              className="p-2 rounded-xl glass hover:bg-white/10 text-neutral-500 hover:text-white transition-all active:scale-90"
              title="Copy"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
            <button 
              onClick={handleSave}
              className="p-2 rounded-xl glass hover:bg-white/10 text-neutral-500 hover:text-white transition-all active:scale-90"
              title="Save to Library"
            >
              {isSaved ? <Check size={14} className="text-green-400" /> : <Bookmark size={14} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          {timestamp && (
            <span className="text-[10px] text-neutral-600 font-bold tracking-widest uppercase">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {isAssistant && content && (
            <span className="text-[10px] text-blue-600/50 font-black tracking-widest uppercase italic">Verified Flow</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
