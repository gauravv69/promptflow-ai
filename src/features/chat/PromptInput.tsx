import { SendHorizonal, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, type KeyboardEvent } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { sendMessageStream } from '@/lib/api';

export const PromptInput = () => {
  const [value, setValue] = useState('');
  const { addMessage, updateLastMessageContent, isLoading, setLoading } = useChatStore();

  const handleSend = async () => {
    if (!value.trim() || isLoading) return;

    const prompt = value;
    setValue('');
    
    // 1. Add user message
    addMessage(prompt, 'user');
    
    // 2. Add an empty assistant message to store streaming content
    addMessage('', 'assistant');
    
    setLoading(true);
    
    // 3. Get current history for context
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

  return (
    <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto flex items-end gap-3 bg-neutral-900 px-4 py-3 rounded-2xl border border-neutral-800 focus-within:ring-2 focus-within:ring-blue-600/30 transition-all duration-300">
        <button className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors">
          <Plus size={20} />
        </button>
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "AI is thinking..." : "Ask PromptFlow anything..."}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none text-neutral-100 placeholder:text-neutral-600 py-1 cursor-text resize-none max-h-48 disabled:opacity-50"
        />
        <button 
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className={cn(
            "p-2 rounded-xl transition-all duration-300 transform active:scale-95 flex items-center justify-center",
            value && !isLoading 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
              : "bg-neutral-800 text-neutral-600 opacity-50"
          )}
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <SendHorizonal size={20} />}
        </button>
      </div>
      <p className="mt-2 text-[10px] text-center text-neutral-600 uppercase tracking-widest font-bold">
        Modular AI System: Swap your mock with real OpenAI/Gemini endpoints in lib/api.ts.
      </p>
    </div>
  );
};
