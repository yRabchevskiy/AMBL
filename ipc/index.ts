import { registerUserHandlers } from './user.handlers';
import { registerBackupHandlers } from './backup.handlers';
import { registerLogHandlers } from './log.handlers';
import { registerAuthHandlers } from './auth.hendlers';
import { initFileHandlers } from './file.handlers';
import { registerStructureHandlers } from './structure.handlers';

export function initIpcHandlers() {
  // Реєструємо модульні обробники
  registerUserHandlers();
  registerBackupHandlers();
  registerLogHandlers();
  registerAuthHandlers();
  initFileHandlers();
  registerStructureHandlers(); // Додаємо обробники для структури

  
  console.log('✅ Всі IPC обробники ініціалізовано');
}