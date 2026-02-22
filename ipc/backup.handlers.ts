import { ipcMain, app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import log from 'electron-log';

export function registerBackupHandlers() {
  ipcMain.handle('get-backups-list', async () => {
    const backupRoot = path.join(app.getPath('userData'), 'backups');
    if (!fs.existsSync(backupRoot)) return [];
    
    try {
      return fs.readdirSync(backupRoot)
        .map(name => ({
          name,
          date: fs.statSync(path.join(backupRoot, name)).mtime
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (err) {
      log.error('[Backup IPC] Помилка списку:', err);
      return [];
    }
  });

  ipcMain.handle('create-manual-backup', async () => {
    // Викликаємо подію в main.ts для виконання бекапу
    app.emit('do-manual-backup'); 
    return { success: true };
  });

  ipcMain.handle('restore-from-backup', async (event, backupName: string) => {
    log.warn(`[Backup IPC] Запит на відновлення: ${backupName}`);
    app.emit('request-restore', backupName);
    return { success: true };
  });
}