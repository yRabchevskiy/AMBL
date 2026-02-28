"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalEvents = void 0;
const electron_1 = require("electron"); // Тільки те, що стосується Electron
const mongoose_1 = __importDefault(require("mongoose")); // Імпортуємо mongoose окремо
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const fsEx = __importStar(require("fs-extra"));
const electron_log_1 = __importDefault(require("electron-log"));
// Імпортуємо наш новий модульний реєстратор IPC
const ipc_1 = require("./ipc");
// Імпортуємо міграції
const migrations_1 = require("./migrations");
const events_1 = require("events");
exports.internalEvents = new events_1.EventEmitter();
// --- НАЛАШТУВАННЯ ЛОГУВАННЯ ---
electron_log_1.default.transports.file.resolvePathFn = () => path.join(electron_1.app.getPath('userData'), 'logs/main.log');
electron_log_1.default.initialize();
electron_log_1.default.info('--- ЗАПУСК ДОДАТКУ AMBL ---');
// --- ГЛОБАЛЬНІ ЗМІННІ ---
let mainWindow = null;
let splashWindow = null;
let mongoProcess = null;
const isDev = process.env['NODE_ENV'] === 'development';
const platform = process.platform;
const port = 27017;
// --- ДОПОМІЖНІ ФУНКЦІЇ ---
/**
 * Створює необхідні системні папки
 */
function ensureDirectoriesExist() {
    const dbPath = path.join(electron_1.app.getPath('userData'), 'ambl-db-data');
    const logPath = path.join(electron_1.app.getPath('userData'), 'logs');
    const backupPath = path.join(electron_1.app.getPath('userData'), 'backups');
    [dbPath, logPath, backupPath].forEach(p => {
        if (!fs.existsSync(p))
            fs.mkdirSync(p, { recursive: true });
    });
}
/**
 * Створює бекап папки з даними MongoDB
 */
function createDatabaseBackup() {
    return __awaiter(this, arguments, void 0, function* (isManual = false) {
        const userDataPath = electron_1.app.getPath('userData');
        const dbPath = path.join(userDataPath, 'ambl-db-data');
        const backupRoot = path.join(userDataPath, 'backups');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const prefix = isManual ? 'manual-' : 'auto-';
        const backupPath = path.join(backupRoot, `${prefix}${timestamp}`);
        try {
            if (fs.existsSync(dbPath)) {
                yield fsEx.copy(dbPath, backupPath);
                electron_log_1.default.info(`Бекап створено: ${backupPath}`);
                return { success: true, name: `${prefix}${timestamp}` };
            }
            return { success: false, error: 'DB path not found' };
        }
        catch (err) {
            electron_log_1.default.error('Помилка бекапу:', err);
            return { success: false, error: err.message };
        }
    });
}
/**
 * Запуск локального процесу MongoDB та підключення Mongoose
 */
function startMongoDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbPath = path.join(electron_1.app.getPath('userData'), 'ambl-db-data');
        ensureDirectoriesExist();
        const mongoBin = electron_1.app.isPackaged
            ? path.join(process.resourcesPath, 'bin', platform, platform === 'win32' ? 'mongod.exe' : 'mongod')
            : path.join(__dirname, 'resources', 'bin', platform, platform === 'win32' ? 'mongod.exe' : 'mongod');
        electron_log_1.default.info(`Запуск MongoDB з: ${mongoBin}`);
        mongoProcess = (0, child_process_1.spawn)(mongoBin, [`--dbpath=${dbPath}`, `--port=${port}`, '--bind_ip=127.0.0.1']);
        return new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(false), 15000);
            const connect = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield mongoose_1.default.connect(`mongodb://127.0.0.1:${port}/ambl_db`);
                    clearTimeout(timeout);
                    electron_log_1.default.info('Mongoose підключено.');
                    yield (0, migrations_1.runMigrations)(); // Запуск міграцій після підключення
                    yield (0, migrations_1.seedAdmin)(); // <-- ДОДАЙ ЦЕЙ РЯДОК
                    resolve(true);
                }
                catch (e) {
                    setTimeout(connect, 1000);
                }
            });
            connect();
        });
    });
}
// --- УПРАВЛІННЯ ВІКНАМИ ---
function createSplashWindow() {
    splashWindow = new electron_1.BrowserWindow({
        width: 400, height: 300, frame: false, transparent: true, alwaysOnTop: true,
        webPreferences: { contextIsolation: true }
    });
    splashWindow.loadFile(path.join(__dirname, 'splash.html'));
}
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200, height: 800, show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:4200');
    }
    else {
        mainWindow.loadFile(path.join(__dirname, 'dist/ambl/browser/index.html'));
    }
    mainWindow.once('ready-to-show', () => {
        if (splashWindow)
            splashWindow.close();
        mainWindow === null || mainWindow === void 0 ? void 0 : mainWindow.show();
    });
}
// --- ЖИТТЄВИЙ ЦИКЛ APP ---
electron_1.app.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Реєструємо всі модульні IPC обробники (User, Backup, Logs)
    (0, ipc_1.initIpcHandlers)();
    // 2. Показуємо заставку
    createSplashWindow();
    // 3. Робимо автоматичний бекап перед стартом
    yield createDatabaseBackup(false);
    // 4. Стартуємо БД та головне вікно
    if (yield startMongoDB()) {
        createMainWindow();
    }
    else {
        electron_log_1.default.error('Критична помилка: БД не запустилася.');
        electron_1.app.quit();
    }
}));
// Слухаємо внутрішні запити на системні операції
exports.internalEvents.on('do-manual-backup', () => __awaiter(void 0, void 0, void 0, function* () {
    yield createDatabaseBackup(true);
}));
exports.internalEvents.on('request-restore', (backupName) => __awaiter(void 0, void 0, void 0, function* () {
    electron_log_1.default.warn(`Відновлення з ${backupName}...`);
    if (mongoose_1.default.connection.readyState !== 0)
        yield mongoose_1.default.disconnect();
    if (mongoProcess)
        mongoProcess.kill('SIGINT');
    const dbPath = path.join(electron_1.app.getPath('userData'), 'ambl-db-data');
    const backupPath = path.join(electron_1.app.getPath('userData'), 'backups', backupName);
    yield fsEx.remove(dbPath);
    yield fsEx.copy(backupPath, dbPath);
    electron_1.app.relaunch();
    electron_1.app.exit();
}));
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('will-quit', () => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 0)
        yield mongoose_1.default.disconnect();
    if (mongoProcess)
        mongoProcess.kill('SIGINT');
}));
