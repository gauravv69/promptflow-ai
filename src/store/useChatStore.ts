import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Conversation, Message, Role } from '@/types/chat';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  isLoading: boolean;
  
  // Actions
  createNewChat: () => void;
  setActiveChat: (id: string) => void;
  addMessage: (content: string, role: Role) => string; // Returns the generated message ID
  updateLastMessageContent: (content: string) => void;
  deleteChat: (id: string) => void;
  setLoading: (status: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId: null,
      isLoading: false,

      createNewChat: () => {
        useAnalyticsStore.getState().trackConversation();
        const newChat: Conversation = {
          id: uuidv4(),
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
        };
        set((state) => ({
          conversations: [newChat, ...state.conversations],
          activeId: newChat.id,
        }));
      },

      setActiveChat: (id) => set({ activeId: id }),

      addMessage: (content, role) => {
        const { activeId } = get();
        let currentId = activeId;
        const msgId = uuidv4();

        // If no active chat, create one
        if (!currentId) {
          useAnalyticsStore.getState().trackConversation();
          const newId = uuidv4();
          const newChat: Conversation = {
            id: newId,
            title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
            messages: [],
            createdAt: Date.now(),
          };
          set((state) => ({
            conversations: [newChat, ...state.conversations],
            activeId: newId,
          }));
          currentId = newId;
        }

        if (role === 'user') {
          useAnalyticsStore.getState().trackMessage();
        }
        
        const newMessage: Message = {
          id: msgId,
          role,
          content,
          createdAt: Date.now(),
        };

        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === currentId) {
              const isFirstUserMessage = role === 'user' && c.messages.length === 0;
              const newTitle = isFirstUserMessage 
                ? content.slice(0, 25) + (content.length > 25 ? '...' : '') 
                : c.title;

              return {
                ...c,
                title: newTitle,
                messages: [...c.messages, newMessage],
              };
            }
            return c;
          }),
        }));

        return msgId;
      },

      updateLastMessageContent: (content) => {
        const { activeId } = get();
        if (!activeId) return;

        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === activeId && c.messages.length > 0) {
              const updatedMessages = [...c.messages];
              const lastIndex = updatedMessages.length - 1;
              updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                content: updatedMessages[lastIndex].content + content,
              };
              return { ...c, messages: updatedMessages };
            }
            return c;
          }),
        }));
      },

      deleteChat: (id) => set((state) => ({
        conversations: state.conversations.filter((c) => c.id !== id),
        activeId: state.activeId === id ? (state.conversations[1]?.id || null) : state.activeId,
      })),

      setLoading: (status) => set({ isLoading: status }),
    }),
    {
      name: 'promptflow-chat-storage',
    }
  )
);
