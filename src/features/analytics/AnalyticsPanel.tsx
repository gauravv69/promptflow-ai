import { useAnalyticsStore } from '@/store/useAnalyticsStore';
import { Terminal, Bookmark, MessageSquare, Activity } from 'lucide-react';
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
      label: 'Sessions', 
      value: totalConversationsCreated, 
      icon: MessageSquare, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
  ];

  return (
    <div className="px-4 py-6 border-t border-white/5 bg-white/[0.01]">
      <div className="flex items-center gap-2 mb-4 px-2 text-neutral-500">
        <Activity size={12} className="text-blue-500 animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Neural Metrics</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center justify-center py-3 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-blue-500/20 hover:bg-white/[0.05] transition-all duration-300 group cursor-default"
          >
            <div className={`p-1.5 rounded-lg ${stat.bg} ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={12} />
            </div>
            <span className="text-xs font-black text-white leading-none tracking-tight">{stat.value}</span>
            <span className="text-[8px] text-neutral-600 uppercase tracking-tighter font-bold mt-1.5 group-hover:text-neutral-500 transition-colors">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
