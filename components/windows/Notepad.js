'use client';

import { useState, useEffect } from 'react';
import { useFileStore } from '@/store/fileStore';

export default function Notepad() {
  const { editingFile, setEditingFile, currentPath } = useFileStore();
  const [fileName, setFileName] = useState('untitled.txt');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  // Sync component state when the globally selected editingFile changes
  useEffect(() => {
    if (editingFile) {
      setFileName(editingFile.name);
      setContent(editingFile.content || '');
    } else {
      setFileName('untitled.txt');
      setContent('');
    }
    setStatus('');
  }, [editingFile]);

  const handleSave = () => {
    const trimmedName = fileName.trim();
    if (!trimmedName) {
      setStatus('Error: Filename cannot be empty.');
      return;
    }

    const { files, currentPath: storePath } = useFileStore.getState();
    const targetPath = editingFile ? editingFile.path : storePath;

    // Check if the file already exists in this folder
    const exists = files.find(
      (f) =>
        f.path === targetPath &&
        f.name.toLowerCase() === trimmedName.toLowerCase()
    );

    useFileStore.setState((state) => {
      let updatedFiles;
      if (exists) {
        // Overwrite the existing file content
        updatedFiles = state.files.map((f) =>
          f.path === targetPath && f.name.toLowerCase() === trimmedName.toLowerCase()
            ? { ...f, content }
            : f
        );
        setStatus('File saved successfully!');
      } else {
        // Create a new file in the directory
        updatedFiles = [
          ...state.files,
          { name: trimmedName, type: 'file', path: targetPath, content },
        ];
        setStatus('New file created and saved!');
      }

      const updatedFile = { name: trimmedName, type: 'file', path: targetPath, content };
      return {
        files: updatedFiles,
        editingFile: updatedFile,
      };
    });

    // Clear status log after 3 seconds
    setTimeout(() => setStatus(''), 3000);
  };

  const handleNew = () => {
    setEditingFile(null);
    setFileName('untitled.txt');
    setContent('');
    setStatus('Ready for new file.');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans p-2 select-text">
      {/* Tool bar controls */}
      <div className="flex gap-2 items-center pb-2 border-b border-slate-800 shrink-0">
        <button
          onClick={handleNew}
          className="bg-slate-800 hover:bg-slate-700 text-xs px-2.5 py-1 rounded font-medium transition cursor-pointer"
          title="Create clean text buffer"
        >
          New
        </button>
        
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Filename (e.g. note.txt)"
          className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 outline-none w-44 font-mono focus:border-blue-500/40"
        />
        
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-1 rounded font-bold transition cursor-pointer"
        >
          Save
        </button>
        
        {status && (
          <span className={`text-[10px] font-mono ml-2 ${status.includes('Error') ? 'text-rose-400' : 'text-emerald-400'}`}>
            {status}
          </span>
        )}
      </div>

      {/* Editor Space */}
      <div className="flex-1 mt-2 bg-slate-950 border border-slate-850 rounded p-1 flex">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type notes or code here... Then click 'Save' to write it to the simulated disk."
          className="flex-1 bg-transparent text-slate-200 p-2 outline-none font-mono text-sm resize-none"
        />
      </div>
    </div>
  );
}
