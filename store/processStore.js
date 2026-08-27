import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialProcesses = [
  { id: 101, name: 'System Shell', cpuUsage: 2, memoryUsage: 45, status: 'Running', burstTime: 6, arrivalTime: 0, priority: 2 },
];

const pidToWindowMap = {
  102: 'file-explorer',
  103: 'terminal',
  104: 'task-manager',
  105: 'scheduler',
  106: 'memory',
  107: 'notepad',
};

// To resolve circular dependency, we store a reference to useDesktopStore here
let desktopStoreRef = null;
export const setDesktopStoreRef = (store) => {
  desktopStoreRef = store;
};

export const useProcessStore = create(
  persist(
    (set, get) => ({
      processes: initialProcesses,

      killProcess: (id) => {
        // 1. Update state first
        set((state) => ({
          processes: state.processes.filter((p) => String(p.id) !== String(id)),
        }));

        // 2. Now that local state is updated, close the corresponding window safely
        const windowId = pidToWindowMap[id];
        if (windowId && desktopStoreRef) {
          const desktopState = desktopStoreRef.getState();
          const win = desktopState.windows.find((w) => w.id === windowId);
          if (win && win.isOpen) {
            desktopState.closeWindow(windowId);
          }
        }
      },

      addProcess: (newProcess) =>
        set((state) => {
          // Avoid duplicate processes
          const exists = state.processes.some((p) => String(p.id) === String(newProcess.id));
          if (exists) return {};
          
          return {
            processes: [
              ...state.processes,
              {
                id: newProcess.id,
                name: newProcess.name,
                cpuUsage: newProcess.cpuUsage ?? Math.floor(Math.random() * 8) + 1,
                memoryUsage: newProcess.memoryUsage ?? Math.floor(Math.random() * 40) + 10,
                status: newProcess.status ?? 'Running',
                burstTime: newProcess.burstTime ?? 5,
                arrivalTime: newProcess.arrivalTime ?? 0,
                priority: newProcess.priority ?? 2,
              },
            ],
          };
        }),
    }),
    {
      name: 'nova-processes-storage',
    }
  )
);