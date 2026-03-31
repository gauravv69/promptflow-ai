import { Plus, MessageSquare, Settings, LogOut, Trash2, Layers, Bookmark, X } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { AnalyticsPanel } from '@/features/analytics/AnalyticsPanel';

interface SidebarProps {
  setView: Dispatch<SetStateAction<'chat' | 'saved'>>;
  activeView: 'chat' | 'saved';
  onClose?: () => void;
}

export const Sidebar = ({ setView, activeView, onClose }: SidebarProps) => {
  const { conversations, activeId, setActiveChat, createNewChat, deleteChat } = useChatStore();
  const logout = useAuthStore((state) => state.logout);

  const handleAction = (callback: () => void) => {
    callback();
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-full h-full bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col transition-all duration-300">
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Layers className="text-white" size={20} />
          </div>
          <span className="font-bold tracking-tighter text-xl">PromptFlow</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        <button 
          onClick={() => handleAction(createNewChat)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black hover:bg-neutral-200 rounded-2xl transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>New Session</span>
        </button>

        <nav className="space-y-1">
          <button 
            onClick={() => handleAction(() => setView('chat'))}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
              activeView === 'chat' 
                ? "bg-white/10 text-white" 
                : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
            )}
          >
            <Layers size={18} className={cn(activeView === 'chat' ? "text-blue-400" : "group-hover:text-neutral-300")} />
            <span>Assistants</span>
          </button>
          <button 
            onClick={() => handleAction(() => setView('saved'))}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm font-medium",
              activeView === 'saved' 
                ? "bg-white/10 text-white" 
                : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
            )}
          >
            <Bookmark size={18} className={cn(activeView === 'saved' ? "text-purple-400" : "group-hover:text-neutral-300")} />
            <span>Saved Library</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1 mt-4">
        <div className="text-[10px] font-black text-neutral-600 px-4 py-2 uppercase tracking-[0.2em]">
          Recent Activity
        </div>
        
        {conversations.length === 0 && (
          <div className="px-4 py-8 text-center bg-white/[0.02] rounded-2xl mx-2 border border-white/[0.05]">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest leading-relaxed">
              Begin your first<br/>AI journey
            </p>
          </div>
        )}

        {conversations.map((chat) => (
          <div key={chat.id} className="group relative px-2">
            <button
              onClick={() => handleAction(() => setActiveChat(chat.id))}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm",
                activeId === chat.id 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
              )}
            >
              <MessageSquare size={16} className={cn(
                activeId === chat.id ? "text-blue-400" : "text-neutral-600 group-hover:text-neutral-400"
              )} />
              <span className="truncate pr-6 font-medium leading-none">{chat.title}</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-neutral-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <AnalyticsPanel />

      <div className="p-4 mt-auto border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition-all text-sm font-medium">
          <Settings size={18} />
          <span>Config</span>
        </button>
        <button 
          onClick={() => handleAction(logout)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-neutral-600 hover:text-red-400 hover:bg-red-500/5 transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Dismiss Session</span>
        </button>
      </div>
    </aside>
  );
};
