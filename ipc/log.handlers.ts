import { ipcMain, shell, app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import log from 'electron-log';

export function registerLogHandlers() {
  // Відкрити папку з логами у провіднику
  ipcMain.on('open-logs-folder', () => {
    const logPath = path.join(app.getPath('userData'), 'logs');
    log.info('[Log IPC] Відкриття папки з логами');
    shell.openPath(logPath);
  });

  // Отримати розмір файлу логів (корисно для адмінки)
  ipcMain.handle('get-log-size', async () => {
    try {
      const logFilePath = log.transports.file.getFile().path;
      if (fs.existsSync(logFilePath)) {
        const stats = fs.statSync(logFilePath);
        return (stats.size / 1024).toFixed(2) + ' KB';
      }
      return '0 KB';
    } catch (err) {
      log.error('[Log IPC] Помилка отримання розміру логів:', err);
      return 'N/A';
    }
  });

  // Очистити файл логів
  ipcMain.handle('clear-logs', async () => {
    try {
      const logFilePath = log.transports.file.getFile().path;
      fs.writeFileSync(logFilePath, '');
      log.info('[Log IPC] Файл логів очищено користувачем');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
}