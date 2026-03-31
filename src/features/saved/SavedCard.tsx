import { Trash2, Copy, Send, Tag as TagIcon, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSavedStore } from '@/store/useSavedStore';
import { useChatStore } from '@/store/useChatStore';
import type { SavedItem } from '@/types/saved';
import { useState } from 'react';

interface SavedCardProps {
  item: SavedItem;
}

export const SavedCard = ({ item }: SavedCardProps) => {
  const { removeItem, updateTags } = useSavedStore();
  const { addMessage } = useChatStore();
  const [isCopied, setIsCopied] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleUsePrompt = () => {
    addMessage(item.content, 'user');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (!item.tags.includes(newTag.trim())) {
        updateTags(item.id, [...item.tags, newTag.trim()]);
      }
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateTags(item.id, item.tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 group transition-all hover:border-neutral-700 shadow-lg shadow-black/20">
      <div className="flex justify-between items-start">
        <span className={cn(
          "text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full border",
          item.type === 'prompt' ? "text-blue-400 border-blue-900/30 bg-blue-950/20" : "text-green-400 border-green-900/30 bg-green-950/20"
        )}>
          {item.type}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleCopy} 
            className={cn(
              "p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-colors relative",
              isCopied && "text-green-400"
            )} 
            title="Copy"
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          {item.type === 'prompt' && (
            <button onClick={handleUsePrompt} className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-blue-400 transition-colors" title="Use as prompt">
              <Send size={14} />
            </button>
          )}
          <button onClick={() => removeItem(item.id)} className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-red-400 transition-colors" title="Remove">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="text-sm text-neutral-300 line-clamp-3 leading-relaxed">
        {item.content}
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        {item.tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 text-[10px] bg-neutral-800 text-neutral-400 px-2 py-1 rounded-md border border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200 transition-colors cursor-default">
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-red-400">
              <X size={10} />
            </button>
          </span>
        ))}
        {isAddingTag ? (
          <input
            autoFocus
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            onBlur={() => setIsAddingTag(false)}
            placeholder="Tag name..."
            className="text-[10px] bg-neutral-950 border border-blue-600/50 text-white px-2 py-1 rounded-md outline-none w-20"
          />
        ) : (
          <button 
            onClick={() => setIsAddingTag(true)}
            className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-neutral-300 px-2 py-1 rounded-md border border-dashed border-neutral-800 hover:border-neutral-700 transition-all"
          >
            <TagIcon size={10} />
            <span>Add tag</span>
          </button>
        )}
      </div>

      <div className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest pt-1">
        {new Date(item.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};
