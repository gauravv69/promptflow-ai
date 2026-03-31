import { Plus, MessageSquare, Settings, LogOut } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen transition-all duration-300">
      <div className="p-4">
        <button className="w-full flex items-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg border border-neutral-700 transition-colors duration-200">
          <Plus size={18} />
          <span className="font-medium text-sm">New Chat</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 space-y-1">
        <div className="text-xs font-semibold text-neutral-500 px-3 py-2 uppercase tracking-wider">
          Recent Chats
        </div>
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-all group"
          >
            <MessageSquare size={16} className="text-neutral-500 group-hover:text-neutral-300" />
            <span className="text-sm truncate">AI-Powered Workflow {i}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-md transition-all">
          <Settings size={18} />
          <span className="text-sm">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-md transition-all">
          <LogOut size={18} />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
};
