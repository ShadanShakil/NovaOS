import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { makeDirectory, createFile, removeNode, resolvePath } from '@/lib/filesystem';

const initialFiles = [
  { name: 'Documents', type: 'folder', path: '/home/nova' },
  { name: 'Downloads', type: 'folder', path: '/home/nova' },
  { name: 'Pictures', type: 'folder', path: '/home/nova' },
  { name: 'notes.txt', type: 'file', path: '/home/nova', content: 'Welcome to NovaOS VFS!' },
  { name: 'project_report.pdf', type: 'file', path: '/home/nova/Documents', content: 'OS Lab Report' },
  { name: 'wallpaper.png', type: 'file', path: '/home/nova/Pictures', content: 'Image Data' },
];

export const useFileStore = create(
  persist(
    (set, get) => ({
      currentPath: '/home/nova',
      files: initialFiles,
      editingFile: null,

      setEditingFile: (file) => set({ editingFile: file }),

      // Set Current Working Directory (returns true if path is valid, false otherwise)
      setCurrentPath: (path) => {
        const { files, currentPath } = get();
        const resolved = resolvePath(currentPath, path, files);
        if (resolved) {
          set({ currentPath: resolved });
          return true;
        }
        return false;
      },

      // Navigate Up
      navigateBack: () => {
        const { files, currentPath } = get();
        const resolved = resolvePath(currentPath, '..', files);
        if (resolved) {
          set({ currentPath: resolved });
        }
      },

      // Create Directory
      makeDirectory: (folderName) => {
        const { files, currentPath } = get();
        const result = makeDirectory(files, currentPath, folderName);
        if (result.success) {
          set({ files: result.files });
          return result.message;
        }
        return result.error;
      },

      // Create File
      createFile: (fileName, content = '') => {
        const { files, currentPath } = get();
        const result = createFile(files, currentPath, fileName, content);
        if (result.success) {
          set({ files: result.files });
          return result.message;
        }
        return result.error;
      },

      // Remove Node
      removeNode: (name) => {
        const { files, currentPath } = get();
        const result = removeNode(files, currentPath, name);
        if (result.success) {
          set({ files: result.files });
          return result.message;
        }
        return result.error;
      },
    }),
    {
      name: 'nova-files-storage',
    }
  )
);