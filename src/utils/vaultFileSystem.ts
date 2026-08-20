import { ObsidianRecipe } from '../types';
import { parseObsidianRecipeMarkdown, serializeRecipeToObsidianMarkdown } from './markdownParser';

/**
 * Checks if Native File System Access API is supported
 */
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

/**
 * Prompts user to pick their Obsidian Vault directory
 */
export async function pickVaultDirectory(): Promise<{
  recipes: ObsidianRecipe[];
  folderHandle: any;
  folderName: string;
}> {
  if (!isFileSystemAccessSupported()) {
    throw new Error('File System Access API is not supported in this browser. Please use the Folder Upload button instead.');
  }

  // @ts-ignore
  const dirHandle = await window.showDirectoryPicker({
    mode: 'readwrite',
    startIn: 'documents',
  });

  const recipes: ObsidianRecipe[] = [];

  async function scanDirectory(handle: any, currentPath: string = '') {
    // @ts-ignore
    for await (const entry of handle.values()) {
      const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
      if (entry.kind === 'file' && entry.name.endsWith('.md')) {
        try {
          const file = await entry.getFile();
          const text = await file.text();
          const parsed = parseObsidianRecipeMarkdown(text, entry.name, entryPath);
          parsed.fileHandle = entry;
          recipes.push(parsed);
        } catch (e) {
          console.warn('Failed to parse file:', entry.name, e);
        }
      } else if (entry.kind === 'directory' && !entry.name.startsWith('.')) {
        await scanDirectory(entry, entryPath);
      }
    }
  }

  await scanDirectory(dirHandle, dirHandle.name);

  return {
    recipes,
    folderHandle: dirHandle,
    folderName: dirHandle.name,
  };
}

/**
 * Saves a recipe directly to the local Obsidian vault fileHandle if available
 */
export async function saveRecipeToVaultFile(
  recipe: ObsidianRecipe,
  folderHandle?: any
): Promise<boolean> {
  const markdown = serializeRecipeToObsidianMarkdown(recipe);

  // If we already have a direct file handle
  if (recipe.fileHandle && typeof recipe.fileHandle.createWritable === 'function') {
    try {
      const writable = await recipe.fileHandle.createWritable();
      await writable.write(markdown);
      await writable.close();
      return true;
    } catch (e) {
      console.warn('Direct file handle write failed, trying folder handle:', e);
    }
  }

  // If we have a folder handle, create/overwrite file
  if (folderHandle && typeof folderHandle.getFileHandle === 'function') {
    try {
      const safeFileName = recipe.fileName.endsWith('.md') ? recipe.fileName : `${recipe.title.replace(/[\/\\?%*:|"<>]/g, '-')}.md`;
      const fileHandle = await folderHandle.getFileHandle(safeFileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(markdown);
      await writable.close();
      recipe.fileHandle = fileHandle;
      return true;
    } catch (e) {
      console.error('Folder handle write failed:', e);
    }
  }

  // Fallback: Download file to user disk
  downloadMarkdownFile(recipe.fileName || `${recipe.title}.md`, markdown);
  return true;
}

/**
 * Downloads a markdown file to the user's computer
 */
export function downloadMarkdownFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads uploaded files from <input type="file" webkitdirectory /> or File[]
 */
export async function parseUploadedFileList(fileList: FileList | File[]): Promise<ObsidianRecipe[]> {
  const recipes: ObsidianRecipe[] = [];
  const count = 'length' in fileList ? fileList.length : 0;
  for (let i = 0; i < count; i++) {
    const file = fileList[i];
    if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
      const text = await file.text();
      const relativePath = (file as any).webkitRelativePath || file.name;
      const parsed = parseObsidianRecipeMarkdown(text, file.name, relativePath);
      recipes.push(parsed);
    }
  }
  return recipes;
}

/**
 * Parses files and folders from HTML5 drag and drop DataTransfer
 */
export async function parseDroppedFilesAndFolders(dataTransfer: DataTransfer): Promise<ObsidianRecipe[]> {
  const recipes: ObsidianRecipe[] = [];

  // Helper to read FileEntry
  async function readFileEntry(fileEntry: any, path: string = ''): Promise<void> {
    return new Promise((resolve) => {
      fileEntry.file(
        async (file: File) => {
          if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
            try {
              const text = await file.text();
              const parsed = parseObsidianRecipeMarkdown(text, file.name, path ? `${path}/${file.name}` : file.name);
              recipes.push(parsed);
            } catch (err) {
              console.warn('Failed to parse dropped file:', file.name, err);
            }
          }
          resolve();
        },
        () => resolve()
      );
    });
  }

  // Helper to read DirectoryEntry
  async function readDirectoryEntry(dirEntry: any, path: string = ''): Promise<void> {
    const dirReader = dirEntry.createReader();
    const currentPath = path ? `${path}/${dirEntry.name}` : dirEntry.name;

    return new Promise((resolve) => {
      const readEntries = () => {
        dirReader.readEntries(async (entries: any[]) => {
          if (!entries.length) {
            resolve();
            return;
          }
          for (const entry of entries) {
            if (entry.isFile) {
              await readFileEntry(entry, currentPath);
            } else if (entry.isDirectory && !entry.name.startsWith('.')) {
              await readDirectoryEntry(entry, currentPath);
            }
          }
          readEntries();
        }, () => resolve());
      };
      readEntries();
    });
  }

  // Check items with webkitGetAsEntry
  const items = dataTransfer.items;
  if (items && items.length > 0 && typeof items[0].webkitGetAsEntry === 'function') {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const entry = item.webkitGetAsEntry();
      if (entry) {
        if (entry.isFile) {
          await readFileEntry(entry);
        } else if (entry.isDirectory) {
          await readDirectoryEntry(entry);
        }
      }
    }
  } else if (dataTransfer.files && dataTransfer.files.length > 0) {
    const fromFiles = await parseUploadedFileList(dataTransfer.files);
    recipes.push(...fromFiles);
  }

  return recipes;
}

