/**
 * Pure helper functions for the simulated filesystem (VFS)
 */

// Create a new folder in the files array
export function makeDirectory(files, currentPath, folderName) {
  const normalizedFolderName = folderName.trim();
  if (!normalizedFolderName) {
    return { success: false, error: 'mkdir: missing operand', files };
  }
  
  // Check if a file or folder with the same name already exists in the current directory
  const exists = files.some(
    (f) => f.path === currentPath && f.name.toLowerCase() === normalizedFolderName.toLowerCase()
  );
  
  if (exists) {
    return {
      success: false,
      error: `mkdir: cannot create directory '${normalizedFolderName}': File exists`,
      files
    };
  }

  const newFiles = [...files, { name: normalizedFolderName, type: 'folder', path: currentPath }];
  return {
    success: true,
    message: `Folder '${normalizedFolderName}' created successfully.`,
    files: newFiles
  };
}

// Create a new file in the files array
export function createFile(files, currentPath, fileName, content = '') {
  const normalizedFileName = fileName.trim();
  if (!normalizedFileName) {
    return { success: false, error: 'touch: missing operand', files };
  }

  const exists = files.some(
    (f) => f.path === currentPath && f.name.toLowerCase() === normalizedFileName.toLowerCase()
  );

  if (exists) {
    return {
      success: false,
      error: `touch: file '${normalizedFileName}' already exists`,
      files
    };
  }

  const newFiles = [...files, { name: normalizedFileName, type: 'file', path: currentPath, content }];
  return {
    success: true,
    message: `File '${normalizedFileName}' created.`,
    files: newFiles
  };
}

// Remove a file or folder from the files array
export function removeNode(files, currentPath, name) {
  const normalizedName = name.trim();
  if (!normalizedName) {
    return { success: false, error: 'rm: missing operand', files };
  }

  const exists = files.some(
    (f) => f.path === currentPath && f.name.toLowerCase() === normalizedName.toLowerCase()
  );

  if (!exists) {
    return {
      success: false,
      error: `rm: cannot remove '${normalizedName}': No such file or directory`,
      files
    };
  }

  const newFiles = files.filter(
    (f) => !(f.path === currentPath && f.name.toLowerCase() === normalizedName.toLowerCase())
  );
  return {
    success: true,
    message: `'${normalizedName}' removed.`,
    files: newFiles
  };
}

// Resolve and validate a destination directory path
export function resolvePath(currentPath, targetPath, files) {
  if (!targetPath || targetPath.trim() === '' || targetPath === '~') {
    return '/home/nova';
  }
  
  const cleanTarget = targetPath.trim();
  if (cleanTarget === '/') return '/';

  let resolved = cleanTarget.startsWith('/')
    ? cleanTarget
    : (currentPath === '/' ? `/${cleanTarget}` : `${currentPath}/${cleanTarget}`);

  // Normalize path segments (handle '.' and '..')
  const segments = resolved.split('/').filter(Boolean);
  const stack = [];
  
  for (const segment of segments) {
    if (segment === '..') {
      if (stack.length > 0) {
        stack.pop();
      }
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  const finalPath = '/' + stack.join('/');

  // Root paths are always valid directories
  if (finalPath === '/home/nova' || finalPath === '/home' || finalPath === '/') {
    return finalPath;
  }

  // Check if finalPath is a folder in our files array
  const isDir = files.some(
    (f) =>
      f.type === 'folder' &&
      (f.path === '/' ? `/${f.name}` : `${f.path}/${f.name}`) === finalPath
  );

  return isDir ? finalPath : null;
}
