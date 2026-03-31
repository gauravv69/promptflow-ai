import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { Sidebar } from '@/features/sidebar/Sidebar';

interface ChatLayoutProps {
  children: ReactNode;
  setView: Dispatch<SetStateAction<'chat' | 'saved'>>;
  activeView: 'chat' | 'saved';
}

export const ChatLayout = ({ children, setView, activeView }: ChatLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-neutral-950 text-neutral-100 dark overflow-hidden selection:bg-blue-600/30">
      <Sidebar setView={setView} activeView={activeView} />
      <main className="flex-1 flex flex-col relative overflow-hidden backdrop-blur-3xl bg-gradient-to-tr from-neutral-950 via-neutral-950 to-neutral-900/40">
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        {children}
      </main>
    </div>
  );
};
