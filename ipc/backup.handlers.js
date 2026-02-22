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
exports.registerBackupHandlers = registerBackupHandlers;
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const electron_log_1 = __importDefault(require("electron-log"));
function registerBackupHandlers() {
    electron_1.ipcMain.handle('get-backups-list', () => __awaiter(this, void 0, void 0, function* () {
        const backupRoot = path.join(electron_1.app.getPath('userData'), 'backups');
        if (!fs.existsSync(backupRoot))
            return [];
        try {
            return fs.readdirSync(backupRoot)
                .map(name => ({
                name,
                date: fs.statSync(path.join(backupRoot, name)).mtime
            }))
                .sort((a, b) => b.date.getTime() - a.date.getTime());
        }
        catch (err) {
            electron_log_1.default.error('[Backup IPC] Помилка списку:', err);
            return [];
        }
    }));
    electron_1.ipcMain.handle('create-manual-backup', () => __awaiter(this, void 0, void 0, function* () {
        // Викликаємо подію в main.ts для виконання бекапу
        electron_1.app.emit('do-manual-backup');
        return { success: true };
    }));
    electron_1.ipcMain.handle('restore-from-backup', (event, backupName) => __awaiter(this, void 0, void 0, function* () {
        electron_log_1.default.warn(`[Backup IPC] Запит на відновлення: ${backupName}`);
        electron_1.app.emit('request-restore', backupName);
        return { success: true };
    }));
}
