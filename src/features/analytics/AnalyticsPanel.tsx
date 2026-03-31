import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { Terminal, Bookmark, MessageSquare, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsPanel = () => {
  const { totalMessagesSent, totalConversationsCreated, totalSavedItems } = useAnalyticsStore();

  const stats = [
    { 
      label: 'Prompts', 
      value: totalMessagesSent, 
      icon: Terminal, 
      color: 'text-blue-400',
      bg: 'bg-blue-400/10' 
    },
    { 
      label: 'Library', 
      value: totalSavedItems, 
      icon: Bookmark, 
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    { 
      label: 'Chats', 
      value: totalConversationsCreated, 
      icon: MessageSquare, 
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
  ];

  return (
    <div className="px-4 py-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3 text-neutral-500">
        <BarChart3 size={14} />
        <span className="text-[10px] uppercase tracking-[0.2em] font-black italic">Usage Analytics</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-950 border border-neutral-800/50 hover:border-neutral-700 transition-colors group"
          >
            <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} mb-1 group-hover:scale-110 transition-transform`}>
              <stat.icon size={12} />
            </div>
            <span className="text-xs font-black text-white">{stat.value}</span>
            <span className="text-[8px] text-neutral-500 uppercase tracking-tighter font-bold">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
