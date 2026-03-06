import { registerUserHandlers } from './user.handlers';
import { registerBackupHandlers } from './backup.handlers';
import { registerLogHandlers } from './log.handlers';
import { registerAuthHandlers } from './auth.hendlers';
import { initFileHandlers } from './file.handlers';

export function initIpcHandlers() {
  // Реєструємо модульні обробники
  registerUserHandlers();
  registerBackupHandlers();
  registerLogHandlers();
  registerAuthHandlers();
  initFileHandlers();

  
  console.log('✅ Всі IPC обробники ініціалізовано');
}