'use client';

import { useState, useEffect } from 'react';
import WindowFrame from '@/components/windows/WindowFrame';
import Terminal from '@/components/windows/Terminal';
import TaskManager from '@/components/windows/TaskManager';
import FileExplorer from '@/components/windows/FileExplorer';
import SchedulerLab from '@/components/windows/SchedulerLab';
import MemoryManager from '@/components/windows/MemoryManager';
import Notepad from '@/components/windows/Notepad';
import Taskbar from '@/components/desktop/Taskbar';
import { useDesktopStore } from '@/store/desktopStore';
import { Folder, Terminal as TerminalIcon, Activity, Cpu, Database, FileText } from 'lucide-react';

export default function Home() {
  const { openWindow } = useDesktopStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
        <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span>Initializing NovaOS...</span>
      </div>
    );
  }

  const apps = [
    { id: 'file-explorer', label: 'Files', color: 'text-yellow-400 hover:text-yellow-300', icon: Folder },
    { id: 'terminal', label: 'Terminal', color: 'text-emerald-400 hover:text-emerald-300', icon: TerminalIcon },
    { id: 'task-manager', label: 'Tasks', color: 'text-blue-400 hover:text-blue-300', icon: Activity },
    { id: 'scheduler', label: 'Scheduler', color: 'text-indigo-400 hover:text-indigo-300', icon: Cpu },
    { id: 'memory', label: 'Memory', color: 'text-purple-400 hover:text-purple-300', icon: Database },
    { id: 'notepad', label: 'Notepad', color: 'text-sky-400 hover:text-sky-300', icon: FileText },
  ];

  return (
    <main className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#0c0f18_0%,_#010204_100%)] relative flex flex-col select-none">
      
      {/* Background Watermark Nova Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-[500px] h-[500px] md:w-[650px] md:h-[650px] text-white">
          <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 7" />
          <path d="M 75 62 L 75 138" stroke="currentColor" strokeWidth="9.5" strokeLinecap="round" />
          <path d="M 125 62 L 125 138" stroke="currentColor" strokeWidth="9.5" strokeLinecap="round" />
          <path d="M 75 62 L 125 138" stroke="currentColor" strokeWidth="9.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Desktop Grid Icons */}
      <div className="p-6 grid grid-cols-1 gap-5 w-28 z-10">
        {apps.map((app) => {
          const IconComponent = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => openWindow(app.id)}
              className="flex flex-col items-center justify-center p-2 rounded-xl text-white transition cursor-pointer group"
            >
              <div className={`p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/40 group-hover:shadow-blue-500/5 ${app.color}`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <span className="text-[11px] mt-2 font-medium tracking-wide text-slate-400 group-hover:text-slate-200 transition">
                {app.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Windows Layer */}
      <WindowFrame id="terminal" title="CLI Terminal"><Terminal /></WindowFrame>
      <WindowFrame id="task-manager" title="Task Manager"><TaskManager /></WindowFrame>
      <WindowFrame id="file-explorer" title="File Explorer"><FileExplorer /></WindowFrame>
      <WindowFrame id="scheduler" title="CPU Scheduler Lab"><SchedulerLab /></WindowFrame>
      <WindowFrame id="memory" title="Memory Visualizer"><MemoryManager /></WindowFrame>
      <WindowFrame id="notepad" title="Notepad"><Notepad /></WindowFrame>

      {/* Bottom Taskbar */}
      <Taskbar />
    </main>
  );
}