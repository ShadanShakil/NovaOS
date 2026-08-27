import { describe, it, expect } from 'vitest';
import { removeNode } from './filesystem';

describe('VFS Filesystem Operations', () => {
  it('recursively deletes a folder and its immediate nested child file', () => {
    const files = [
      { name: 'Documents', type: 'folder', path: '/home/nova' },
      { name: 'project_report.pdf', type: 'file', path: '/home/nova/Documents', content: 'OS Lab Report' },
      { name: 'notes.txt', type: 'file', path: '/home/nova', content: 'Welcome to NovaOS VFS!' },
    ];

    // Delete 'Documents' folder at '/home/nova'
    const result = removeNode(files, '/home/nova', 'Documents');

    expect(result.success).toBe(true);
    
    // The folder itself should be gone
    const folderExists = result.files.some((f) => f.path === '/home/nova' && f.name === 'Documents');
    expect(folderExists).toBe(false);

    // The nested file inside it should be gone
    const childFileExists = result.files.some((f) => f.path === '/home/nova/Documents' && f.name === 'project_report.pdf');
    expect(childFileExists).toBe(false);

    // Sibling file 'notes.txt' at the root should remain untouched
    const siblingFileExists = result.files.some((f) => f.path === '/home/nova' && f.name === 'notes.txt');
    expect(siblingFileExists).toBe(true);
  });

  it('recursively deletes a folder with a nested subfolder that itself contains a file (2 levels deep)', () => {
    const files = [
      { name: 'Documents', type: 'folder', path: '/home/nova' },
      { name: 'OS_Project', type: 'folder', path: '/home/nova/Documents' },
      { name: 'code.c', type: 'file', path: '/home/nova/Documents/OS_Project', content: 'int main() {}' },
      { name: 'notes.txt', type: 'file', path: '/home/nova', content: 'Welcome to NovaOS!' },
    ];

    // Delete 'Documents' folder at '/home/nova'
    const result = removeNode(files, '/home/nova', 'Documents');

    expect(result.success).toBe(true);

    // All 3 nested items should be gone
    const folderExists = result.files.some((f) => f.path === '/home/nova' && f.name === 'Documents');
    const subfolderExists = result.files.some((f) => f.path === '/home/nova/Documents' && f.name === 'OS_Project');
    const nestedFileExists = result.files.some((f) => f.path === '/home/nova/Documents/OS_Project' && f.name === 'code.c');

    expect(folderExists).toBe(false);
    expect(subfolderExists).toBe(false);
    expect(nestedFileExists).toBe(false);

    // Unrelated sibling file should remain
    const siblingFileExists = result.files.some((f) => f.path === '/home/nova' && f.name === 'notes.txt');
    expect(siblingFileExists).toBe(true);
  });

  it('deleting a single file (not a folder) still only removes that one entry and leaves siblings untouched', () => {
    const files = [
      { name: 'Documents', type: 'folder', path: '/home/nova' },
      { name: 'notes.txt', type: 'file', path: '/home/nova', content: 'Welcome to NovaOS VFS!' },
      { name: 'todo.txt', type: 'file', path: '/home/nova', content: 'Finish lab' },
    ];

    // Delete 'notes.txt' file at '/home/nova'
    const result = removeNode(files, '/home/nova', 'notes.txt');

    expect(result.success).toBe(true);

    // notes.txt should be gone
    const fileExists = result.files.some((f) => f.path === '/home/nova' && f.name === 'notes.txt');
    expect(fileExists).toBe(false);

    // Sibling folder and sibling file should remain untouched
    const folderExists = result.files.some((f) => f.path === '/home/nova' && f.name === 'Documents');
    const siblingFileExists = result.files.some((f) => f.path === '/home/nova' && f.name === 'todo.txt');

    expect(folderExists).toBe(true);
    expect(siblingFileExists).toBe(true);
  });
});
