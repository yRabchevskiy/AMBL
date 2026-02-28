import { User } from './models/user.model';
import bcrypt from 'bcrypt';
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

// FOR SEEDING INITIAL ADMIN USER!!! NEED to remove in production

export async function seedAdmin() {
  const adminEmail = 'admin@ambl.com';
  
  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      log.info('Створення початкового адміністратора...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = new User({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });

      await admin.save();
      log.info('Адміністратор успішно створений: admin@ambl.com / admin123');
    } else {
      log.info('Адміністратор уже існує в базі.');
    }
  } catch (error) {
    log.error('Помилка при створенні адміна:', error);
  }
}