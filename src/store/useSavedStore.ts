import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SavedItem } from '@/types/saved';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

interface SavedState {
  savedItems: SavedItem[];
  
  // Actions
  saveItem: (content: string, type: 'prompt' | 'response', tags?: string[]) => string;
  removeItem: (id: string) => void;
  updateTags: (id: string, tags: string[]) => void;
  searchItems: (query: string) => SavedItem[];
  filterByTag: (tag: string) => SavedItem[];
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedItems: [],

      saveItem: (content, type, tags = []) => {
        useAnalyticsStore.getState().trackSavedItem(true);
        const id = uuidv4();
        const newItem: SavedItem = {
          id,
          content,
          type,
          tags,
          createdAt: Date.now(),
        };
        
        set((state) => ({
          savedItems: [newItem, ...state.savedItems],
        }));
        
        return id;
      },

      removeItem: (id) => {
        useAnalyticsStore.getState().trackSavedItem(false);
        set((state) => ({
          savedItems: state.savedItems.filter((i) => i.id !== id),
        }));
      },

      updateTags: (id, tags) => set((state) => ({
        savedItems: state.savedItems.map((i) => 
          i.id === id ? { ...i, tags } : i
        ),
      })),

      searchItems: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().savedItems.filter((i) => 
          i.content.toLowerCase().includes(lowerQuery) || 
          i.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      },

      filterByTag: (tag) => {
        return get().savedItems.filter((i) => i.tags.includes(tag));
      },
    }),
    {
      name: 'promptflow-saved-storage',
    }
  )
);
