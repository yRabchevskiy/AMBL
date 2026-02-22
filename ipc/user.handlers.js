"use strict";
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
exports.registerUserHandlers = registerUserHandlers;
const electron_1 = require("electron");
const electron_log_1 = __importDefault(require("electron-log"));
const user_model_1 = require("../models/user.model");
function registerUserHandlers() {
    electron_1.ipcMain.handle('db-save-user', (event, userData) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = new user_model_1.User(userData);
            const savedUser = yield user.save();
            // ПРАВИЛЬНО: Конвертуємо в простий об'єкт перед відправкою через IPC
            return {
                success: true,
                data: savedUser.toObject()
            };
        }
        catch (err) {
            electron_log_1.default.error('[User IPC] Помилка збереження:', err);
            // ПРАВИЛЬНО: Передаємо лише текст помилки, а не весь об'єкт Error
            return { success: false, error: err.message };
        }
    }));
    electron_1.ipcMain.handle('db-get-users', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield user_model_1.User.find({}).sort({ createdAt: -1 }).lean();
            // .lean() каже Mongoose відразу повертати чисті JSON-об'єкти, що швидше і не викликає помилок клонування
            return users;
        }
        catch (err) {
            electron_log_1.default.error('[User IPC] Помилка отримання:', err);
            return [];
        }
    }));
    electron_1.ipcMain.handle('db-clear-all', () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield user_model_1.User.deleteMany({});
            return { success: true };
        }
        catch (err) {
            electron_log_1.default.error('[User IPC] Помилка очищення:', err);
            return { success: false };
        }
    }));
}
