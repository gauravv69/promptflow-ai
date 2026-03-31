import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowRight, Globe, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login and redirect to the main app
    login();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-mesh relative overflow-hidden px-4">
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20">
            <Zap className="text-white fill-white/20" size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            PromptFlow
          </h1>
          <p className="text-neutral-500 font-medium tracking-tight">
            The neural interface for modern AI.
          </p>
        </div>

        <div className="glass-card p-8 md:p-10 border-white/5">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 px-1">Email Terminal</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexus.com"
                  className="w-full bg-white/[0.03] border border-white/5 focus:border-blue-500/30 focus:bg-white/[0.05] rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-neutral-700 outline-none transition-all duration-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 px-1">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/5 focus:border-blue-500/30 focus:bg-white/[0.05] rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-neutral-700 outline-none transition-all duration-500"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-neutral-200 active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-2 shadow-xl shadow-white/5 group"
            >
              <span>Initialize Session</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                <span className="bg-[#030303] px-4 text-neutral-600">Secure SSO Auth</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 px-4 glass border-white/5 rounded-2xl hover:bg-white/5 transition-all text-xs font-bold text-neutral-400 hover:text-white group">
                <Globe size={16} className="group-hover:rotate-12 transition-transform" />
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-3 px-4 glass border-white/5 rounded-2xl hover:bg-white/5 transition-all text-xs font-bold text-neutral-400 hover:text-white group">
                <Code size={16} className="group-hover:scale-110 transition-transform" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em]">
          Modular AI Infrastructure <span className="text-neutral-800 mx-2">|</span> v2.4 Stable
        </p>
      </motion.div>
    </div>
  );
};
