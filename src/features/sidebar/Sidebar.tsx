import { Plus, MessageSquare, Settings, LogOut, Trash2, Layers, Bookmark } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/useChatStore';
import { AnalyticsPanel } from '@/features/analytics/AnalyticsPanel';

interface SidebarProps {
  setView: Dispatch<SetStateAction<'chat' | 'saved'>>;
  activeView: 'chat' | 'saved';
}

export const Sidebar = ({ setView, activeView }: SidebarProps) => {
  const { conversations, activeId, setActiveChat, createNewChat, deleteChat } = useChatStore();

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen transition-all duration-300">
      <AnalyticsPanel />
      <div className="p-4 space-y-2">
        <button 
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/20 active:scale-95 mb-2"
        >
          <Plus size={18} />
          <span className="font-medium text-sm">New Chat</span>
        </button>

        <div className="flex flex-col gap-1 pt-2 border-t border-neutral-800">
          <button 
            onClick={() => setView('chat')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-all",
              activeView === 'chat' && "bg-neutral-800 text-white"
            )}
          >
            <Layers size={18} />
            <span className="text-sm">Assistants</span>
          </button>
          <button 
            onClick={() => setView('saved')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-all",
              activeView === 'saved' && "bg-neutral-800 text-white"
            )}
          >
            <Bookmark size={18} />
            <span className="text-sm">Saved Library</span>
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        <div className="text-xs font-semibold text-neutral-500 px-3 py-2 uppercase tracking-wider">
          History
        </div>
        
        {conversations.length === 0 && (
          <p className="text-[10px] text-neutral-600 px-3 py-4 uppercase tracking-widest text-center">
            No recent chats
          </p>
        )}

        {conversations.map((chat) => (
          <div key={chat.id} className="group relative">
            <button
              onClick={() => setActiveChat(chat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-all",
                activeId === chat.id && "bg-neutral-800 text-white border-l-4 border-blue-600"
              )}
            >
              <MessageSquare size={16} className={cn(
                "text-neutral-500 group-hover:text-neutral-300",
                activeId === chat.id && "text-blue-400"
              )} />
              <span className="text-sm truncate pr-6">{chat.title}</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-all">
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-neutral-500 hover:bg-neutral-800 hover:text-white rounded-md transition-all">
          <LogOut size={18} />
          <span className="text-sm text-neutral-400">Sign out</span>
        </button>
      </div>
    </aside>
  );
};
