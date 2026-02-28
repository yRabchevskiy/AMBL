import { registerUserHandlers } from './user.handlers';
import { registerBackupHandlers } from './backup.handlers';
import { registerLogHandlers } from './log.handlers';
import { registerAuthHandlers } from './auth.hendlers';

export function initIpcHandlers() {
  // Реєструємо модульні обробники
  registerUserHandlers();
  registerBackupHandlers();
  registerLogHandlers();
  registerAuthHandlers();

  
  console.log('✅ Всі IPC обробники ініціалізовано');
}