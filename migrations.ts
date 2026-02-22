import { User } from './models/user.model';
import log from 'electron-log';

export async function runMigrations() {
  log.info('Мігації: Початок перевірки...');
  
  try {
    // 1. Перевірка версії (наприклад, додаємо поле 'status' у версії 3)
    const count = await User.countDocuments({ version: { $lt: 3 } });
    
    if (count > 0) {
      log.warn(`Міграції: Знайдено ${count} застарілих записів. Оновлення до v3...`);
      
      const result = await User.updateMany(
        { version: { $lt: 3 } },
        { 
          $set: { 
            status: 'active', 
            version: 3 
          } 
        }
      );
      
      log.info(`Міграції: Успішно оновлено документів: ${result.modifiedCount}`);
    } else {
      log.info('Міграції: База даних вже актуальна (v3).');
    }
  } catch (error) {
    log.error('КРИТИЧНА ПОМИЛКА МІГРАЦІЇ:', error);
    // Можна викинути помилку далі, щоб зупинити запуск додатка
    throw error; 
  }
}