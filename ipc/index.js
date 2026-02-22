"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIpcHandlers = initIpcHandlers;
const user_handlers_1 = require("./user.handlers");
const backup_handlers_1 = require("./backup.handlers");
const log_handlers_1 = require("./log.handlers");
function initIpcHandlers() {
    // Реєструємо модульні обробники
    (0, user_handlers_1.registerUserHandlers)();
    (0, backup_handlers_1.registerBackupHandlers)();
    (0, log_handlers_1.registerLogHandlers)();
    console.log('✅ Всі IPC обробники ініціалізовано');
}
