import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'assistant';
  timestamp?: string;
}

export const MessageBubble = ({ content, sender, timestamp }: MessageBubbleProps) => {
  const isAssistant = sender === 'assistant';

  return (
    <div className={cn(
      "flex w-full mb-8 last:mb-0 transition-opacity animate-in fade-in slide-in-from-bottom-2 duration-300",
      isAssistant ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "max-w-3xl px-6 py-4 rounded-3xl text-base leading-relaxed tracking-tight group relative",
        isAssistant 
          ? "bg-neutral-800 text-neutral-50 shadow-lg shadow-neutral-900/40" 
          : "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
      )}>
        <p className="whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <span className="text-[10px] mt-2 block opacity-40 uppercase tracking-widest font-bold">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};
