import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnalyticsState {
  totalMessagesSent: number;
  totalConversationsCreated: number;
  totalSavedItems: number;
  
  // Actions
  trackMessage: () => void;
  trackConversation: () => void;
  trackSavedItem: (isAdded: boolean) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => ({
      totalMessagesSent: 0,
      totalConversationsCreated: 0,
      totalSavedItems: 0,

      trackMessage: () => set((state) => ({ 
        totalMessagesSent: state.totalMessagesSent + 1 
      })),
      
      trackConversation: () => set((state) => ({ 
        totalConversationsCreated: state.totalConversationsCreated + 1 
      })),
      
      trackSavedItem: (isAdded) => set((state) => ({ 
        totalSavedItems: state.totalSavedItems + (isAdded ? 1 : -1) 
      })),
    }),
    {
      name: 'promptflow-analytics-storage',
    }
  )
);
