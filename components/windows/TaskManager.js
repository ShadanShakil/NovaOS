'use client';

import { useProcessStore } from '@/store/processStore';

export default function TaskManager() {
  const { processes, killProcess } = useProcessStore();

  return (
    <div className="text-white space-y-4">
      <h2 className="text-lg font-bold border-b border-slate-700 pb-2">Active Processes</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400">
            <th className="p-2">PID</th>
            <th className="p-2">Process Name</th>
            <th className="p-2">CPU (%)</th>
            <th className="p-2">RAM (MB)</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((proc) => (
            <tr key={proc.id} className="border-b border-slate-900 hover:bg-slate-900/50">
              <td className="p-2">{proc.id}</td>
              <td className="p-2">{proc.name}</td>
              <td className="p-2">{proc.cpuUsage}%</td>
              <td className="p-2">{proc.memoryUsage} MB</td>
              <td className="p-2">
                <button
                  onClick={() => killProcess(proc.id)}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs px-2 py-1 rounded"
                >
                  Kill Process
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}