'use client';

import { useDesktopStore } from '@/store/desktopStore';
import { X, Minus, Square } from 'lucide-react';

export default function WindowFrame({ id, title, children }) {
  const {
    windows,
    activeWindowId,
    closeWindow,
    minimizeWindow,
    focusWindow,
    updateWindowPosition,
    toggleMaximizeWindow,
  } = useDesktopStore();

  const windowState = windows.find((w) => w.id === id);

  if (!windowState || !windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const isActive = activeWindowId === id;

  // Drag handling
  const handleMouseDown = (e) => {
    // Disable dragging if window is maximized
    if (windowState.isMaximized) return;

    // Focus this window
    focusWindow(id);

    // Only handle left click
    if (e.button !== 0) return;

    // Don't drag if clicking buttons
    if (e.target.closest('button')) return;

    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = {
      x: windowState.position?.x ?? 80,
      y: windowState.position?.y ?? 80,
    };

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      // Calculate new position
      const newX = startPos.x + dx;
      const newY = startPos.y + dy;

      // Allow dragging off-screen slightly but keep it reachable
      updateWindowPosition(id, { x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Determine dynamic sizing style
  const frameStyle = windowState.isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 48px)', // leave space for taskbar (12rem/48px)
        zIndex: windowState.zIndex ?? 10,
      }
    : {
        top: `${windowState.position?.y ?? 80}px`,
        left: `${windowState.position?.x ?? 80}px`,
        width: 'min(650px, 90vw)',
        height: 'min(450px, 80vh)',
        zIndex: windowState.zIndex ?? 10,
      };

  return (
    <div
      onClick={() => focusWindow(id)}
      style={frameStyle}
      className={`absolute bg-slate-900 border rounded-lg shadow-2xl flex flex-col overflow-hidden text-white transition-colors duration-200 ${
        isActive ? 'border-blue-500/80 shadow-blue-500/5' : 'border-slate-800'
      }`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className={`bg-slate-950 px-4 py-2 flex justify-between items-center select-none border-b border-slate-900 ${
          windowState.isMaximized ? 'cursor-default' : 'cursor-move'
        }`}
      >
        <span className={`text-xs font-bold ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
          {title}
        </span>
        <div className="flex items-center gap-2">
          {/* Traffic light style window control buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="h-3.5 w-3.5 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-slate-900 group"
            title="Minimize"
            aria-label={`Minimize ${title} window`}
          >
            <Minus className="h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximizeWindow(id);
            }}
            className="h-3.5 w-3.5 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 focus:ring-offset-slate-900 group"
            title="Maximize"
            aria-label={`Maximize ${title} window`}
          >
            <Square className="h-1.5 w-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="h-3.5 w-3.5 bg-rose-500 hover:bg-rose-400 rounded-full flex items-center justify-center text-slate-950 font-bold focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 focus:ring-offset-slate-900 group"
            title="Close"
            aria-label={`Close ${title} window`}
          >
            <X className="h-2 w-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-hidden bg-slate-950 relative">
        {children}
      </div>
    </div>
  );
}