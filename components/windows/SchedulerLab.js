'use client';

import { useState } from 'react';
import { useProcessStore } from '@/store/processStore';
import { runFCFS, runSJF, runPriority, runRoundRobin } from '@/lib/scheduler';

export default function SchedulerLab() {
  const { processes, addProcess, killProcess } = useProcessStore();

  const [algorithm, setAlgorithm] = useState('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [schedule, setSchedule] = useState([]);
  const [scheduledProcesses, setScheduledProcesses] = useState([]);

  // Form states
  const [newPid, setNewPid] = useState('');
  const [newName, setNewName] = useState('');
  const [newBurst, setNewBurst] = useState('');
  const [newArrival, setNewArrival] = useState('');
  const [newPriority, setNewPriority] = useState('');

  const handleAddProcess = (e) => {
    e.preventDefault();
    if (!newPid || !newBurst) return;

    const burst = Number(newBurst);
    const arrival = newArrival !== '' ? Number(newArrival) : 0;
    const priorityVal = newPriority !== '' ? Number(newPriority) : 1;

    addProcess({
      id: newPid,
      name: newName.trim() || `App-${newPid}`,
      burstTime: burst,
      arrivalTime: arrival,
      priority: priorityVal,
    });

    // Reset fields
    setNewPid('');
    setNewName('');
    setNewBurst('');
    setNewArrival('');
    setNewPriority('');
  };

  const runSimulation = () => {
    if (processes.length === 0) return;

    let result;
    if (algorithm === 'FCFS') {
      result = runFCFS(processes);
    } else if (algorithm === 'SJF') {
      result = runSJF(processes);
    } else if (algorithm === 'Priority') {
      result = runPriority(processes);
    } else if (algorithm === 'RR') {
      result = runRoundRobin(processes, quantum);
    }

    if (result) {
      setSchedule(result.schedule);
      setScheduledProcesses(result.processes);
    }
  };

  const totalTime = schedule.length > 0 ? schedule[schedule.length - 1].end : 0;

  // Calculate average metrics
  const avgWaitingTime =
    scheduledProcesses.length > 0
      ? (scheduledProcesses.reduce((acc, p) => acc + p.waitingTime, 0) / scheduledProcesses.length).toFixed(2)
      : 0;

  const avgTurnaroundTime =
    scheduledProcesses.length > 0
      ? (scheduledProcesses.reduce((acc, p) => acc + p.turnaroundTime, 0) / scheduledProcesses.length).toFixed(2)
      : 0;

  return (
    <div className="p-4 text-white space-y-4 font-sans h-full overflow-y-auto">
      
      {/* Controls & Configuration */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-300">Algorithm:</label>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value);
                setSchedule([]);
                setScheduledProcesses([]);
              }}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs outline-none text-white cursor-pointer"
            >
              <option value="FCFS">First-Come First-Served (FCFS)</option>
              <option value="SJF">Shortest Job First (SJF)</option>
              <option value="Priority">Priority Scheduling</option>
              <option value="RR">Round Robin (RR)</option>
            </select>
          </div>

          {algorithm === 'RR' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-300">Time Quantum:</label>
              <input
                type="number"
                min="1"
                value={quantum}
                onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs w-16 outline-none text-white text-center"
              />
            </div>
          )}
        </div>

        <button
          onClick={runSimulation}
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded text-xs font-bold transition cursor-pointer"
        >
          Run Simulation
        </button>
      </div>

      {/* Add Process Form */}
      <form onSubmit={handleAddProcess} className="grid grid-cols-5 gap-2 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
        <input
          type="text"
          placeholder="PID (e.g. P4)"
          value={newPid}
          onChange={(e) => setNewPid(e.target.value)}
          required
          className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-white outline-none placeholder:text-slate-500"
        />
        <input
          type="text"
          placeholder="Name (e.g. App)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-white outline-none placeholder:text-slate-500"
        />
        <input
          type="number"
          placeholder="Burst Time (s)"
          min="1"
          value={newBurst}
          onChange={(e) => setNewBurst(e.target.value)}
          required
          className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-white outline-none placeholder:text-slate-500"
        />
        <input
          type="number"
          placeholder="Arrival Time (s)"
          min="0"
          value={newArrival}
          onChange={(e) => setNewArrival(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-white outline-none placeholder:text-slate-500"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Priority"
            min="1"
            value={newPriority}
            disabled={algorithm !== 'Priority'}
            onChange={(e) => setNewPriority(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs rounded px-2 py-1 text-white outline-none disabled:opacity-40 flex-1 placeholder:text-slate-500"
          />
          <button type="submit" className="bg-slate-700 hover:bg-slate-600 px-3 py-1 text-xs rounded font-bold cursor-pointer shrink-0">
            + Add
          </button>
        </div>
      </form>

      {/* Active Process Queue */}
      <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
        <h4 className="text-xs uppercase text-slate-400 font-bold mb-2">Process Queue ({processes.length})</h4>
        {processes.length === 0 ? (
          <div className="text-xs text-slate-500 italic">No processes in queue. Add some above.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {processes.map((p) => (
              <span
                key={p.id}
                className="bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-2"
              >
                <span className="font-bold text-slate-300">{p.id}</span>
                <span className="text-[11px] text-slate-400">({p.name})</span>
                <span className="text-indigo-400">BT:{p.burstTime}s</span>
                <span className="text-cyan-400">AT:{p.arrivalTime}s</span>
                <span className="text-amber-400">PR:{p.priority}</span>
                <button
                  type="button"
                  onClick={() => killProcess(p.id)}
                  className="hover:text-red-400 text-slate-500 text-[10px] font-bold ml-1 cursor-pointer transition"
                  title="Remove process"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Gantt Chart Output */}
      <div>
        <h4 className="text-xs uppercase text-slate-400 font-bold mb-2">Visual Gantt Chart</h4>
        {schedule.length === 0 ? (
          <div className="text-xs text-slate-500 italic p-4 bg-slate-900/30 rounded border border-dashed border-slate-800 text-center">
            Click "Run Simulation" to generate the timeline chart.
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex h-12 border border-slate-700 rounded overflow-hidden bg-slate-950">
              {schedule.map((p, idx) => {
                const widthPercent = totalTime > 0 ? (p.duration / totalTime) * 100 : 0;
                return (
                  <div
                    key={idx}
                    style={{ width: `${widthPercent}%` }}
                    className="bg-indigo-600/70 border-r border-slate-950 hover:bg-indigo-500/80 transition flex flex-col items-center justify-center p-1 overflow-hidden"
                    title={`${p.name} (PID: ${p.id}) [${p.start}s - ${p.end}s]`}
                  >
                    <span className="text-[11px] font-bold truncate w-full text-center">{p.id}</span>
                    <span className="text-[9px] opacity-75 truncate w-full text-center">{p.duration}s</span>
                  </div>
                );
              })}
            </div>
            {/* Timeline markers */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono px-1">
              <span>0s</span>
              {schedule.map((p, idx) => (
                <span key={idx}>{p.end}s</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scheduling Metrics Table */}
      {scheduledProcesses.length > 0 && (
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase text-slate-400 font-bold">Execution Metrics</h4>
            <div className="flex gap-4 text-xs font-mono">
              <div>
                Avg Wait: <span className="text-emerald-400 font-bold">{avgWaitingTime}s</span>
              </div>
              <div>
                Avg Turnaround: <span className="text-cyan-400 font-bold">{avgTurnaroundTime}s</span>
              </div>
            </div>
          </div>
          
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-1.5 font-bold">PID</th>
                <th className="pb-1.5 font-bold">Name</th>
                <th className="pb-1.5 font-bold">Arrival</th>
                <th className="pb-1.5 font-bold">Burst</th>
                <th className="pb-1.5 font-bold">Priority</th>
                <th className="pb-1.5 font-bold">Wait Time</th>
                <th className="pb-1.5 font-bold">Turnaround</th>
              </tr>
            </thead>
            <tbody>
              {scheduledProcesses.map((p) => (
                <tr key={p.id} className="border-b border-slate-950 hover:bg-slate-950/40">
                  <td className="py-1.5">{p.id}</td>
                  <td className="py-1.5 text-slate-300">{p.name}</td>
                  <td className="py-1.5">{p.arrivalTime}s</td>
                  <td className="py-1.5 text-indigo-300">{p.burstTime}s</td>
                  <td className="py-1.5 text-amber-300">{p.priority}</td>
                  <td className="py-1.5 text-emerald-400">{p.waitingTime}s</td>
                  <td className="py-1.5 text-cyan-400">{p.turnaroundTime}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}