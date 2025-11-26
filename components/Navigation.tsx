import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { BookOpen, Sparkles, Music, Sword, Globe, Users, Menu, Clock, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activePage: Page;
  setPage: (page: Page) => void;
}

const navItems = [
  { id: Page.BLOG, label: '九州志', icon: BookOpen, color: 'text-blue-400' },
  { id: Page.TOOLBOX, label: '灵台', icon: Sparkles, color: 'text-emerald-400' },
  { id: Page.MUSIC, label: '音乐', icon: Music, color: 'text-amber-400' },
  { id: Page.JIANLAI, label: '剑来', icon: Sword, color: 'text-red-500' },
  { id: Page.WORLD, label: '世界', icon: Globe, color: 'text-cyan-400' },
  { id: Page.FINANCE, label: '金道', icon: TrendingUp, color: 'text-yellow-400' },
  { id: Page.COMMUNITY, label: '树洞', icon: Users, color: 'text-rose-400' },
  { id: Page.ABOUT, label: '更多', icon: Menu, color: 'text-slate-400' },
];

export const Navigation: React.FC<NavigationProps> = ({ activePage, setPage }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Formatters
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    });
  };

  const handleNavClick = (pageId: Page) => {
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
    setPage(pageId);
  };

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <nav className={`
        hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800 z-40
        pt-safe pb-safe
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo Area */}
          <div className="mb-10 flex items-center space-x-3 px-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20 ring-1 ring-white/10">
              <span className="font-bold text-white text-xl serif">九</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-red-400 tracking-wide serif">
                九州
              </h1>
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] block -mt-1">Jiuzhou Group</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2 flex-1 overflow-y-auto no-scrollbar min-h-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700/50 shadow-md translate-x-1' 
                      : 'hover:bg-slate-900/50 hover:translate-x-1 transparent'}
                  `}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? item.color : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className={`font-medium tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className={`ml-auto w-1 h-4 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Time Widget & Footer */}
          <div className="mt-6 pt-6 border-t border-slate-900 flex-shrink-0">
            {/* Clock Widget */}
            <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-800/50 mb-4 group hover:border-amber-500/20 transition-colors">
               <div className="flex items-center justify-between text-slate-500 mb-1">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] tracking-widest uppercase">System Time</span>
               </div>
               <div className="text-2xl font-bold text-slate-200 font-mono tracking-wider tabular-nums group-hover:text-amber-400 transition-colors">
                 {formatTime(time)}
               </div>
               <div className="text-xs text-slate-500 mt-1 font-serif">
                 {formatDate(time)}
               </div>
            </div>

            <div className="text-[10px] text-slate-600 text-center leading-relaxed">
              &copy; 2023 Jiuzhou Group
              <br/>All Souls Connected
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/50 pb-safe">
        {/* Gradient Masks to hint scrolling */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-950/90 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-950/90 to-transparent pointer-events-none z-10" />
        
        <div className="flex items-center px-2 h-16 overflow-x-auto no-scrollbar space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  flex flex-col items-center justify-center min-w-[4.5rem] h-full space-y-1 active:scale-90 transition-transform
                  ${isActive ? 'text-white' : 'text-slate-600 hover:text-slate-400'}
                `}
              >
                <div className={`
                  p-1.5 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-slate-800/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] -translate-y-1' : 'bg-transparent'}
                `}>
                  <Icon className={`w-5 h-5 ${isActive ? item.color : 'currentColor'}`} />
                </div>
                <span className={`text-[9px] font-medium tracking-wide whitespace-nowrap ${isActive ? item.color : ''}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  );
};