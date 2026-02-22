import { ipcMain } from 'electron';
import log from 'electron-log';
import { User } from '../models/user.model';

export function registerUserHandlers() {
  ipcMain.handle('db-save-user', async (event, userData) => {
    try {
      const user = new User(userData);
      const savedUser = await user.save();

      // ПРАВИЛЬНО: Конвертуємо в простий об'єкт перед відправкою через IPC
      return {
        success: true,
        data: savedUser.toObject()
      };
    } catch (err: any) {
      log.error('[User IPC] Помилка збереження:', err);
      // ПРАВИЛЬНО: Передаємо лише текст помилки, а не весь об'єкт Error
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('db-get-users', async () => {
    try {
      const users = await User.find({}).sort({ createdAt: -1 }).lean();
      // .lean() каже Mongoose відразу повертати чисті JSON-об'єкти, що швидше і не викликає помилок клонування
      return users;
    } catch (err) {
      log.error('[User IPC] Помилка отримання:', err);
      return [];
    }
  });

  ipcMain.handle('db-clear-all', async () => {
    try {
      await User.deleteMany({});
      return { success: true };
    } catch (err) {
      log.error('[User IPC] Помилка очищення:', err);
      return { success: false };
    }
  });
}