'use client';

import { useState, useEffect, useRef } from 'react';
import { useFileStore } from '@/store/fileStore';

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    'NovaOS CLI Engine v1.0',
    'Type "help" for a list of commands.',
  ]);

  const {
    currentPath,
    files,
    setCurrentPath,
    makeDirectory,
    createFile,
    removeNode,
  } = useFileStore();

  const historyEndRef = useRef(null);

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const parts = trimmedInput.split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let response = '';

    switch (command) {
      case 'help':
        response = 'Available: ls, cd [dir], pwd, mkdir [dir], touch [file], rm [file/dir], uname, date, clear, help';
        break;
      case 'ls': {
        const items = files.filter((f) => f.path === currentPath);
        if (items.length === 0) {
          response = '(empty directory)';
        } else {
          response = items
            .map((item) => (item.type === 'folder' ? `${item.name}/` : item.name))
            .join('   ');
        }
        break;
      }
      case 'pwd':
        response = currentPath;
        break;
      case 'cd': {
        const success = setCurrentPath(arg || '/home/nova');
        if (!success) {
          response = `cd: no such file or directory: ${arg}`;
        }
        break;
      }
      case 'mkdir':
        if (!arg) {
          response = 'mkdir: missing operand';
        } else {
          response = makeDirectory(arg);
        }
        break;
      case 'touch':
        if (!arg) {
          response = 'touch: missing operand';
        } else {
          response = createFile(arg);
        }
        break;
      case 'rm':
        if (!arg) {
          response = 'rm: missing operand';
        } else {
          response = removeNode(arg);
        }
        break;
      case 'uname':
        response = 'NovaOS x86_64 Web-Kernel';
        break;
      case 'date':
        response = new Date().toLocaleString();
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        response = `Command not found: ${command}`;
    }

    if (response) {
      setHistory((prev) => [...prev, `$ ${input}`, response]);
    } else {
      setHistory((prev) => [...prev, `$ ${input}`]);
    }
    setInput('');
  };

  return (
    <div className="font-mono text-sm text-green-400 h-full flex flex-col p-2 bg-slate-950 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">{line}</div>
        ))}
        <div ref={historyEndRef} />
      </div>
      <form onSubmit={handleCommand} className="mt-2 flex border-t border-slate-900 pt-2 shrink-0">
        <span className="mr-2 text-white shrink-0">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent outline-none flex-1 text-green-400 font-mono text-sm"
          autoFocus
        />
      </form>
    </div>
  );
}