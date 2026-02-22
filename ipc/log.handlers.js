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
exports.registerLogHandlers = registerLogHandlers;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const electron_log_1 = __importDefault(require("electron-log"));
function registerLogHandlers() {
    // Відкрити папку з логами у провіднику
    electron_1.ipcMain.on('open-logs-folder', () => {
        const logPath = path.join(electron_1.app.getPath('userData'), 'logs');
        electron_log_1.default.info('[Log IPC] Відкриття папки з логами');
        electron_1.shell.openPath(logPath);
    });
    // Отримати розмір файлу логів (корисно для адмінки)
    electron_1.ipcMain.handle('get-log-size', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const logFilePath = electron_log_1.default.transports.file.getFile().path;
            if (fs.existsSync(logFilePath)) {
                const stats = fs.statSync(logFilePath);
                return (stats.size / 1024).toFixed(2) + ' KB';
            }
            return '0 KB';
        }
        catch (err) {
            electron_log_1.default.error('[Log IPC] Помилка отримання розміру логів:', err);
            return 'N/A';
        }
    }));
    // Очистити файл логів
    electron_1.ipcMain.handle('clear-logs', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const logFilePath = electron_log_1.default.transports.file.getFile().path;
            fs.writeFileSync(logFilePath, '');
            electron_log_1.default.info('[Log IPC] Файл логів очищено користувачем');
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.message };
        }
    }));
}
