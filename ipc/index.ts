import { registerUserHandlers } from './user.handlers';
import { registerBackupHandlers } from './backup.handlers';
import { registerLogHandlers } from './log.handlers';

export function initIpcHandlers() {
  // Реєструємо модульні обробники
  registerUserHandlers();
  registerBackupHandlers();
  registerLogHandlers();

  
  console.log('✅ Всі IPC обробники ініціалізовано');
}