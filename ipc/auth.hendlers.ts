import bcrypt from 'bcrypt';
import { ipcMain, app } from 'electron';
import { User } from '../models/user.model';

export function registerAuthHandlers() {
  ipcMain.handle('auth-login', async (event, { email, password }) => {
    try {
      const user = await User.findOne({ email }).lean();
      if (!user) return { success: false, error: 'Користувача не знайдено' };

      const match = await bcrypt.compare(password, user.password);
      if (!match) return { success: false, error: 'Невірний пароль' };

      const { password: _, ...userWithoutPassword } = user;
      return { success: true, data: userWithoutPassword };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });
}
