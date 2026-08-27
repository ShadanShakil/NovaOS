'use client';

import { useState } from 'react';
import { allocateMemory, freeMemoryBlock } from '@/lib/memory';

export default function MemoryManager() {
  const [blocks, setBlocks] = useState([
    { id: 1, size: 100, allocated: false, process: null },
    { id: 2, size: 500, allocated: true, process: 'OS Core' },
    { id: 3, size: 200, allocated: false, process: null },
    { id: 4, size: 300, allocated: true, process: 'Terminal' },
    { id: 5, size: 600, allocated: false, process: null },
  ]);

  const [procSize, setProcSize] = useState(150);
  const [algo, setAlgo] = useState('firstFit');
  const [logs, setLogs] = useState(['Memory Manager Initialized. Total RAM: 1700 MB']);

  const totalRAM = blocks.reduce((acc, b) => acc + b.size, 0);

  const handleAllocate = () => {
    if (!procSize || procSize <= 0) return;

    const result = allocateMemory(blocks, procSize, algo);
    if (result.success) {
      setBlocks(result.blocks);
      setLogs((prev) => [result.message, ...prev]);
    } else {
      setLogs((prev) => [result.error, ...prev]);
    }
  };

  const handleFree = (id) => {
    const updatedBlocks = freeMemoryBlock(blocks, id);
    setBlocks(updatedBlocks);
    setLogs((prev) => [`[FREE] Memory Block #${id} released (coalescing ran).`, ...prev]);
  };

  return (
    <div className="p-4 text-white space-y-4 font-sans h-full overflow-y-auto bg-slate-950">
      {/* Allocation Controls */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
        <input
          type="number"
          min="1"
          value={procSize}
          onChange={(e) => setProcSize(Math.max(1, Number(e.target.value)))}
          className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs w-28 outline-none text-white font-mono"
          placeholder="Size (MB)"
        />

        <select
          value={algo}
          onChange={(e) => setAlgo(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-xs outline-none text-white cursor-pointer"
        >
          <option value="firstFit">First Fit</option>
          <option value="bestFit">Best Fit</option>
          <option value="worstFit">Worst Fit</option>
        </select>

        <button
          onClick={handleAllocate}
          className="bg-emerald-600 hover:bg-emerald-500 text-xs px-3 py-1.5 rounded font-bold transition ml-auto cursor-pointer"
        >
          Allocate Memory
        </button>
      </div>

      {/* Memory Grid Visualization */}
      <div>
        <h4 className="text-xs uppercase text-slate-400 font-bold mb-2">
          RAM Allocation Map ({totalRAM} MB Total)
        </h4>
        <div className="flex h-20 w-full rounded-lg overflow-hidden border border-slate-850 bg-slate-950">
          {blocks.map((block) => {
            const widthPercent = (block.size / totalRAM) * 100;
            return (
              <div
                key={block.id}
                style={{ width: `${widthPercent}%` }}
                onClick={() => block.allocated && handleFree(block.id)}
                title={block.allocated ? 'Click to free memory block' : 'Free Block'}
                className={`flex flex-col items-center justify-center border-r border-slate-950 text-xs transition cursor-pointer p-1 overflow-hidden select-none ${
                  block.allocated
                    ? 'bg-rose-900/40 hover:bg-rose-800/60 text-rose-200 border-rose-500/20'
                    : 'bg-emerald-950/30 hover:bg-emerald-950/50 text-emerald-300 border-emerald-900/10'
                }`}
              >
                <span className="font-bold text-[11px] truncate w-full text-center">
                  {block.process || 'Free'}
                </span>
                <span className="text-[10px] opacity-75">{block.size}MB</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Logs */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
        <h4 className="text-xs uppercase text-slate-400 font-bold mb-2">System Memory Logs</h4>
        <div className="font-mono text-[11px] text-slate-300 max-h-28 overflow-y-auto space-y-1">
          {logs.map((log, idx) => (
            <div key={idx} className={log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : 'text-slate-300'}>
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}