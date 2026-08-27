'use client';

import { useFileStore } from '@/store/fileStore';
import { useDesktopStore } from '@/store/desktopStore';

export default function FileExplorer() {
  const { files, currentPath, setCurrentPath, navigateBack, setEditingFile } = useFileStore();
  const { openWindow } = useDesktopStore();

  const currentFiles = files.filter((f) => f.path === currentPath);

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      setCurrentPath(`${currentPath}/${item.name}`);
    } else {
      setEditingFile(item);
      openWindow('notepad');
    }
  };

  return (
    <div className="p-4 text-white h-full flex flex-col">
      {/* Navigation Bar */}
      <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-800">
        <button
          onClick={navigateBack}
          disabled={currentPath === '/home/nova'}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs px-2.5 py-1 rounded font-bold transition"
        >
          ← Back
        </button>
        <span className="text-xs font-mono text-slate-300 bg-slate-950 px-3 py-1 rounded border border-slate-800 flex-1 truncate">
          {currentPath}
        </span>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-4 gap-4 flex-1 overflow-y-auto">
        {currentFiles.length === 0 ? (
          <div className="col-span-4 text-center text-xs text-slate-500 py-10 italic">
            This folder is empty.
          </div>
        ) : (
          currentFiles.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-800/50 transition cursor-pointer select-none"
            >
              <span className="text-3xl mb-2">
                {item.type === 'folder' ? '📁' : '📄'}
              </span>
              <span className="text-xs text-center truncate w-full">{item.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}