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
exports.runMigrations = runMigrations;
const user_model_1 = require("./models/user.model");
const electron_log_1 = __importDefault(require("electron-log"));
function runMigrations() {
    return __awaiter(this, void 0, void 0, function* () {
        electron_log_1.default.info('Мігації: Початок перевірки...');
        try {
            // 1. Перевірка версії (наприклад, додаємо поле 'status' у версії 3)
            const count = yield user_model_1.User.countDocuments({ version: { $lt: 3 } });
            if (count > 0) {
                electron_log_1.default.warn(`Міграції: Знайдено ${count} застарілих записів. Оновлення до v3...`);
                const result = yield user_model_1.User.updateMany({ version: { $lt: 3 } }, {
                    $set: {
                        status: 'active',
                        version: 3
                    }
                });
                electron_log_1.default.info(`Міграції: Успішно оновлено документів: ${result.modifiedCount}`);
            }
            else {
                electron_log_1.default.info('Міграції: База даних вже актуальна (v3).');
            }
        }
        catch (error) {
            electron_log_1.default.error('КРИТИЧНА ПОМИЛКА МІГРАЦІЇ:', error);
            // Можна викинути помилку далі, щоб зупинити запуск додатка
            throw error;
        }
    });
}
