import { useState, useMemo } from 'react';
import { useSavedStore } from '@/store/useSavedStore';
import { SavedCard } from './SavedCard';
import { Bookmark, Search, Tag as TagIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SavedList = () => {
  const { savedItems } = useSavedStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags from saved items
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    savedItems.forEach(item => item.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [savedItems]);

  // Filter items by search query and selected tag
  const filteredItems = useMemo(() => {
    return savedItems.filter(item => {
      const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = !selectedTag || item.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [savedItems, searchQuery, selectedTag]);

  return (
    <div className="flex flex-col h-full bg-neutral-950 border-1 border-neutral-900 rounded-2xl overflow-hidden p-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="text-blue-500" size={24} />
        <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Saved Library</h2>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search saved items or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-blue-600/50 focus:ring-4 focus:ring-blue-600/10 transition-all"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={() => setSelectedTag(null)}
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                !selectedTag ? "bg-blue-600 text-white border-blue-600" : "bg-neutral-900 text-neutral-500 border-neutral-800 hover:border-neutral-700"
              )}
            >
              All
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-1",
                  selectedTag === tag ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-900/30" : "bg-neutral-900 text-neutral-500 border-neutral-800 hover:border-neutral-700"
                )}
              >
                <TagIcon size={10} />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
            <div className="p-6 bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-800">
              <Bookmark size={40} className="text-neutral-600" />
            </div>
            <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">No matches found in your library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
             {filteredItems.map((item) => (
              <SavedCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
