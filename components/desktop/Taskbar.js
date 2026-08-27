'use client';

import { useState, useEffect } from 'react';
import { useDesktopStore } from '@/store/desktopStore';
import { Folder, Terminal as TerminalIcon, Activity, Cpu, Database } from 'lucide-react';

const iconMap = {
  'file-explorer': Folder,
  'terminal': TerminalIcon,
  'task-manager': Activity,
  'scheduler': Cpu,
  'memory': Database,
};

export default function Taskbar() {
  const [time, setTime] = useState(null);
  const { windows, activeWindowId, toggleWindow } = useDesktopStore();
  
  const openWindows = windows.filter((w) => w.isOpen);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-12 bg-slate-950/95 backdrop-blur border-t border-slate-850 flex items-center justify-between px-4 absolute bottom-0 left-0 right-0 z-[9999] select-none">
      {/* Brand logo */}
      <div className="text-sm font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent w-24 shrink-0">
        NovaOS
      </div>
      
      {/* Running Application List */}
      <div className="flex-1 flex justify-center items-center gap-2 overflow-x-auto max-w-[60%] mx-auto py-1 px-2">
        {openWindows.map((w) => {
          const IconComponent = iconMap[w.id];
          const isActive = activeWindowId === w.id && !w.isMinimized;
          
          return (
            <button
              key={w.id}
              onClick={() => toggleWindow(w.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition duration-200 border text-xs font-medium cursor-pointer shrink-0 outline-none focus:ring-1 focus:ring-blue-400 ${
                isActive
                  ? 'bg-blue-600/30 text-blue-200 border-blue-500/50 shadow-sm shadow-blue-500/10'
                  : w.isMinimized
                  ? 'bg-slate-900/40 text-slate-500 border-slate-800 hover:text-slate-400 hover:bg-slate-900/60'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800/80'
              }`}
            >
              {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
              <span className="truncate max-w-[100px]">{w.title}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  isActive ? 'bg-blue-400' : w.isMinimized ? 'bg-amber-500/60' : 'bg-emerald-500'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Clock info */}
      <div className="text-xs text-slate-400 font-mono w-24 text-right shrink-0">
        {time ? time : '--:--'}
      </div>
    </footer>
  );
}