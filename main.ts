import { app, BrowserWindow } from 'electron'; // Тільки те, що стосується Electron
import mongoose from 'mongoose'; // Імпортуємо mongoose окремо
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as fsEx from 'fs-extra';
import log from 'electron-log';

// Імпортуємо наш новий модульний реєстратор IPC
import { initIpcHandlers } from './ipc';
// Імпортуємо міграції
import { runMigrations, seedAdmin } from './migrations';
import { EventEmitter } from 'events';


export const internalEvents = new EventEmitter();
// --- НАЛАШТУВАННЯ ЛОГУВАННЯ ---
log.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs/main.log');
log.initialize();
log.info('--- ЗАПУСК ДОДАТКУ AMBL ---');

// --- ГЛОБАЛЬНІ ЗМІННІ ---
let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;
let mongoProcess: ChildProcess | null = null;

const isDev = process.env['NODE_ENV'] === 'development';
const platform = process.platform;
const port = 27017;

// --- ДОПОМІЖНІ ФУНКЦІЇ ---

/**
 * Створює необхідні системні папки
 */
function ensureDirectoriesExist() {
  const dbPath = path.join(app.getPath('userData'), 'ambl-db-data');
  const logPath = path.join(app.getPath('userData'), 'logs');
  const backupPath = path.join(app.getPath('userData'), 'backups');

  [dbPath, logPath, backupPath].forEach(p => {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  });
}

/**
 * Створює бекап папки з даними MongoDB
 */
async function createDatabaseBackup(isManual: boolean = false) {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'ambl-db-data');
  const backupRoot = path.join(userDataPath, 'backups');
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const prefix = isManual ? 'manual-' : 'auto-';
  const backupPath = path.join(backupRoot, `${prefix}${timestamp}`);

  try {
    if (fs.existsSync(dbPath)) {
      await fsEx.copy(dbPath, backupPath);
      log.info(`Бекап створено: ${backupPath}`);
      return { success: true, name: `${prefix}${timestamp}` };
    }
    return { success: false, error: 'DB path not found' };
  } catch (err: any) {
    log.error('Помилка бекапу:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Запуск локального процесу MongoDB та підключення Mongoose
 */
async function startMongoDB(): Promise<boolean> {
  const dbPath = path.join(app.getPath('userData'), 'ambl-db-data');
  ensureDirectoriesExist();

  const mongoBin = app.isPackaged
    ? path.join(process.resourcesPath, 'bin', platform, platform === 'win32' ? 'mongod.exe' : 'mongod')
    : path.join(__dirname, 'resources', 'bin', platform, platform === 'win32' ? 'mongod.exe' : 'mongod');

  log.info(`Запуск MongoDB з: ${mongoBin}`);
  
  mongoProcess = spawn(mongoBin, [`--dbpath=${dbPath}`, `--port=${port}`, '--bind_ip=127.0.0.1']);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 15000);

    const connect = async () => {
      try {
        await mongoose.connect(`mongodb://127.0.0.1:${port}/ambl_db`);
        clearTimeout(timeout);
        log.info('Mongoose підключено.');
        await runMigrations(); // Запуск міграцій після підключення

        await seedAdmin(); // <-- ДОДАЙ ЦЕЙ РЯДОК

        
        resolve(true);
      } catch (e) {
        setTimeout(connect, 1000);
      }
    };
    connect();
  });
}

// --- УПРАВЛІННЯ ВІКНАМИ ---

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400, height: 300, frame: false, transparent: true, alwaysOnTop: true,
    webPreferences: { contextIsolation: true }
  });
  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200, height: 800, show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:4200');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/ambl/browser/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    if (splashWindow) splashWindow.close();
    mainWindow?.show();
  });
}

// --- ЖИТТЄВИЙ ЦИКЛ APP ---

app.on('ready', async () => {
  // 1. Реєструємо всі модульні IPC обробники (User, Backup, Logs)
  initIpcHandlers();

  // 2. Показуємо заставку
  createSplashWindow();

  // 3. Робимо автоматичний бекап перед стартом
  await createDatabaseBackup(false);

  // 4. Стартуємо БД та головне вікно
  if (await startMongoDB()) {
    createMainWindow();
  } else {
    log.error('Критична помилка: БД не запустилася.');
    app.quit();
  }
});

// Слухаємо внутрішні запити на системні операції
internalEvents.on('do-manual-backup', async () => {
  await createDatabaseBackup(true);
});

internalEvents.on('request-restore', async (backupName: string) => {
  log.warn(`Відновлення з ${backupName}...`);
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  if (mongoProcess) mongoProcess.kill('SIGINT');

  const dbPath = path.join(app.getPath('userData'), 'ambl-db-data');
  const backupPath = path.join(app.getPath('userData'), 'backups', backupName);

  await fsEx.remove(dbPath);
  await fsEx.copy(backupPath, dbPath);

  app.relaunch();
  app.exit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  if (mongoProcess) mongoProcess.kill('SIGINT');
});