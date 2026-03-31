import { Plus, Loader2, Sparkles, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, type KeyboardEvent, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { sendMessageStream } from '@/lib/api';

export const PromptInput = () => {
  const [value, setValue] = useState('');
  const { addMessage, updateLastMessageContent, isLoading, setLoading } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!value.trim() || isLoading) return;

    const prompt = value;
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    
    addMessage(prompt, 'user');
    addMessage('', 'assistant');
    setLoading(true);
    
    const currentChat = useChatStore.getState().conversations.find(
      (c) => c.id === useChatStore.getState().activeId
    );
    const history = currentChat ? currentChat.messages.slice(0, -2) : [];

    try {
      await sendMessageStream(prompt, history, (chunk) => {
        updateLastMessageContent(chunk);
      });
    } catch (error) {
      console.error(error);
      updateLastMessageContent("\n\n**Error:** " + (error instanceof Error ? error.message : "Failed to connect to AI."));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
    setValue(target.value);
  };

  return (
    <div className="p-6 md:p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-2 md:p-3 focus-within:border-blue-500/30 focus-within:bg-white/[0.05] transition-all duration-500 group relative">
          <div className="absolute -top-10 left-0 right-0 flex justify-center opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
            <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full backdrop-blur-md font-bold tracking-widest uppercase">
              Neural Network Active
            </span>
          </div>

          <div className="flex items-end gap-2 md:gap-4 px-2">
            <button className="hidden md:flex p-2.5 glass hover:bg-white/10 rounded-2xl text-neutral-500 hover:text-white transition-all hover:rotate-90">
              <Plus size={20} />
            </button>
            
            <div className="flex-1 min-h-[44px] flex items-center">
              <textarea
                ref={textareaRef}
                rows={1}
                value={value}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? "Thinking..." : "Message PromptFlow..."}
                disabled={isLoading}
                className="w-full bg-transparent border-none outline-none text-neutral-100 placeholder:text-neutral-500 py-2.5 text-sm md:text-base cursor-text resize-none max-h-[200px] disabled:opacity-50 font-medium leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2 mb-1">
              {!value && !isLoading && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                  <Command size={10} />
                  <span>Enter</span>
                </div>
              )}
              
              <button 
                onClick={handleSend}
                disabled={!value.trim() || isLoading}
                className={cn(
                  "p-3 rounded-2xl transition-all duration-500 transform active:scale-90 flex items-center justify-center min-w-[48px]",
                  value && !isLoading 
                    ? "bg-white text-black shadow-2xl shadow-white/10 hover:bg-neutral-200" 
                    : "bg-white/5 text-neutral-600 grayscale"
                )}
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className={value ? "text-blue-600" : ""} />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-[9px] text-neutral-700 font-black uppercase tracking-[0.25em] md:tracking-[0.4em]">
          <span className="hover:text-neutral-500 transition-colors cursor-default">Precision V2.4</span>
          <span className="w-1 h-1 rounded-full bg-neutral-800 self-center" />
          <span className="hover:text-neutral-500 transition-colors cursor-default">Ultra Latency</span>
          <span className="w-1 h-1 rounded-full bg-neutral-800 self-center" />
          <span className="hover:text-neutral-500 transition-colors cursor-default">Global Mesh</span>
        </div>
      </div>
    </div>
  );
};
