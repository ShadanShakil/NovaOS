import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useProcessStore, setDesktopStoreRef } from './processStore';

const initialWindows = [
  { id: 'file-explorer', title: 'File Explorer', isOpen: false, isMinimized: false, isMaximized: false, position: { x: 80, y: 80 }, zIndex: 10 },
  { id: 'terminal', title: 'Terminal CLI', isOpen: false, isMinimized: false, isMaximized: false, position: { x: 110, y: 110 }, zIndex: 10 },
  { id: 'task-manager', title: 'Task Manager', isOpen: false, isMinimized: false, isMaximized: false, position: { x: 140, y: 140 }, zIndex: 10 },
  { id: 'scheduler', title: 'CPU Scheduler Lab', isOpen: false, isMinimized: false, isMaximized: false, position: { x: 170, y: 170 }, zIndex: 10 },
  { id: 'memory', title: 'Memory Visualizer', isOpen: false, isMinimized: false, isMaximized: false, position: { x: 200, y: 200 }, zIndex: 10 },
  { id: 'notepad', title: 'Notepad', isOpen: false, isMinimized: false, isMaximized: false, position: { x: 230, y: 230 }, zIndex: 10 },
];

const windowToPidMap = {
  'file-explorer': 102,
  'terminal': 103,
  'task-manager': 104,
  'scheduler': 105,
  'memory': 106,
  'notepad': 107,
};

export const useDesktopStore = create(
  persist(
    (set, get) => ({
      windows: initialWindows,
      activeWindowId: null,
      maxZIndex: 10,
      nextPosition: { x: 80, y: 80 },

      openWindow: (id) => {
        let isAlreadyOpen = false;
        let title = '';

        set((state) => {
          const win = state.windows.find((w) => w.id === id);
          if (!win) return {};

          isAlreadyOpen = win.isOpen;
          title = win.title;
          const newMaxZ = state.maxZIndex + 1;
          let nextPos = { ...state.nextPosition };

          const updatedWindows = state.windows.map((w) => {
            if (w.id === id) {
              const updates = { isOpen: true, isMinimized: false, zIndex: newMaxZ };
              if (!w.isOpen) {
                updates.position = { ...nextPos };
              }
              return { ...w, ...updates };
            }
            return w;
          });

          // Cascade position
          if (!isAlreadyOpen) {
            nextPos.x += 30;
            nextPos.y += 30;
            if (nextPos.x > 350 || nextPos.y > 250) {
              nextPos = { x: 80, y: 80 };
            }
          }

          return {
            windows: updatedWindows,
            activeWindowId: id,
            maxZIndex: newMaxZ,
            nextPosition: nextPos,
          };
        });

        // Sync: add to processStore outside set callback
        if (!isAlreadyOpen) {
          const pid = windowToPidMap[id];
          if (pid) {
            useProcessStore.getState().addProcess({
              id: pid,
              name: title,
            });
          }
        }
      },

      closeWindow: (id) => {
        // 1. Update state first
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isOpen: false, isMinimized: false, isMaximized: false } : w
          ),
          activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        }));

        // 2. Now that local state has been updated, sync processStore safely
        const pid = windowToPidMap[id];
        if (pid) {
          const processState = useProcessStore.getState();
          const processExists = processState.processes.some((p) => String(p.id) === String(pid));
          if (processExists) {
            processState.killProcess(pid);
          }
        }
      },

      minimizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMinimized: true } : w
          ),
          activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        })),

      focusWindow: (id) => {
        let title = '';

        set((state) => {
          const win = state.windows.find((w) => w.id === id);
          if (!win) return {};
          title = win.title;
          const newMaxZ = state.maxZIndex + 1;
          
          return {
            windows: state.windows.map((w) =>
              w.id === id ? { ...w, zIndex: newMaxZ, isMinimized: false, isOpen: true } : w
            ),
            activeWindowId: id,
            maxZIndex: newMaxZ,
          };
        });

        // Sync processes list outside set callback
        const pid = windowToPidMap[id];
        if (pid) {
          useProcessStore.getState().addProcess({
            id: pid,
            name: title,
          });
        }
      },

      toggleWindow: (id) => {
        let shouldAddProcess = false;
        let title = '';

        set((state) => {
          const win = state.windows.find((w) => w.id === id);
          if (!win) return {};

          const newMaxZ = state.maxZIndex + 1;
          const isActive = state.activeWindowId === id;
          title = win.title;

          let updatedWindows = state.windows.map((w) => {
            if (w.id === id) {
              if (w.isMinimized) {
                return { ...w, isMinimized: false, zIndex: newMaxZ };
              } else if (isActive) {
                return { ...w, isMinimized: true };
              } else {
                return { ...w, isMinimized: false, zIndex: newMaxZ };
              }
            }
            return w;
          });

          const nextActiveId = (win.isMinimized || !isActive) ? id : null;
          shouldAddProcess = (win.isMinimized || !isActive);

          return {
            windows: updatedWindows,
            activeWindowId: nextActiveId,
            maxZIndex: newMaxZ,
          };
        });

        // Sync processes list outside set callback when restoring
        if (shouldAddProcess) {
          const pid = windowToPidMap[id];
          if (pid) {
            useProcessStore.getState().addProcess({ id: pid, name: title });
          }
        }
      },

      updateWindowPosition: (id, position) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        })),

      toggleMaximizeWindow: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
          ),
        })),
    }),
    {
      name: 'nova-desktop-storage',
      merge: (persistedState, initialState) => {
        if (!persistedState) return initialState;
        
        // Custom merge to guarantee newly defined initial windows (Notepad) are added
        const mergedWindows = [...initialState.windows];
        if (persistedState.windows) {
          persistedState.windows.forEach((pWin) => {
            const idx = mergedWindows.findIndex((w) => w.id === pWin.id);
            if (idx !== -1) {
              mergedWindows[idx] = { ...mergedWindows[idx], ...pWin };
            }
          });
        }

        return {
          ...initialState,
          ...persistedState,
          windows: mergedWindows,
        };
      },
    }
  )
);

// Register the store reference to resolve circular dependency
setDesktopStoreRef(useDesktopStore);