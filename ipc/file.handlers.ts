import { ipcMain, dialog } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export function initFileHandlers() {
  // 1. Вибір папки
  ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // 2. Читання вмісту
  ipcMain.handle('read-directory', async (event, folderPath: string) => {
    try {
      // Перевірка на випадок, якщо folderPath прийшов порожнім
      if (!folderPath) throw new Error('Path is required');

      const files = fs.readdirSync(folderPath);

      return files.map(file => {
        // Формуємо повний шлях до поточного файлу/папки
        const fullPath = path.join(folderPath, file);
        const stats = fs.statSync(fullPath);

        return {
          name: file,
          path: fullPath, // Тепер це поле доступне в Angular
          isDirectory: stats.isDirectory(),
          size: stats.size
        };
      });
    } catch (error: any) {
      console.error('Помилка читання директорії:', error);
      // Важливо повертати масив, щоб NgFor не "падав", або обробляти об'єкт помилки
      return [];
    }
  });
}