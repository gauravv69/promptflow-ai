import { useState, type ReactNode, Dispatch, SetStateAction } from 'react';
import { Sidebar } from '@/features/sidebar/Sidebar';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatLayoutProps {
  children: ReactNode;
  setView: Dispatch<SetStateAction<'chat' | 'saved'>>;
  activeView: 'chat' | 'saved';
}

export const ChatLayout = ({ children, setView, activeView }: ChatLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#030303] text-neutral-100 overflow-hidden selection:bg-blue-600/30">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 w-[280px]",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar setView={setView} activeView={activeView} onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-mesh">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        </div>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/[0.05] bg-black/20 backdrop-blur-xl z-30">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="font-bold tracking-tighter text-lg flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-lg" />
            PromptFlow
          </div>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <div className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
