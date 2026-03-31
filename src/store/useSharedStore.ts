import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation } from '@/types/chat';

interface SharedState {
  sharedChats: Record<string, Conversation>;
  
  // Actions
  shareConversation: (conversation: Conversation) => string;
  getSharedConversation: (shareId: string) => Conversation | undefined;
}

export const useSharedStore = create<SharedState>()(
  persist(
    (set, get) => ({
      sharedChats: {},

      shareConversation: (conversation) => {
        // Create a deep copy to ensure it remains read-only for the shared link
        const shareId = uuidv4();
        const sharedData = JSON.parse(JSON.stringify(conversation));
        
        set((state) => ({
          sharedChats: {
            ...state.sharedChats,
            [shareId]: sharedData,
          },
        }));
        
        return shareId;
      },

      getSharedConversation: (shareId) => {
        return get().sharedChats[shareId];
      },
    }),
    {
      name: 'promptflow-shared-storage',
    }
  )
);
