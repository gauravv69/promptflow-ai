import { SendHorizonal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const PromptInput = () => {
  const [value, setValue] = useState('');

  return (
    <div className="p-4 border-t border-neutral-800 bg-neutral-950/50 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto flex items-end gap-3 bg-neutral-900 px-4 py-3 rounded-2xl border border-neutral-800 focus-within:ring-2 focus-within:ring-blue-600/30 transition-all duration-300">
        <button className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors">
          <Plus size={20} />
        </button>
        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your prompt..."
          className="flex-1 bg-transparent border-none outline-none text-neutral-100 placeholder:text-neutral-600 py-1 cursor-text resize-none max-h-48"
        />
        <button 
          className={cn(
            "p-2 rounded-xl transition-all duration-300 transform active:scale-95",
            value ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "bg-neutral-800 text-neutral-600"
          )}
        >
          <SendHorizonal size={20} />
        </button>
      </div>
      <p className="mt-2 text-[10px] text-center text-neutral-600 uppercase tracking-widest font-bold">
        PromptFlow AI may generate inaccurate info.
      </p>
    </div>
  );
};
