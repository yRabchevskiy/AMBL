"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIpcHandlers = initIpcHandlers;
const user_handlers_1 = require("./user.handlers");
const backup_handlers_1 = require("./backup.handlers");
const log_handlers_1 = require("./log.handlers");
const auth_hendlers_1 = require("./auth.hendlers");
const file_handlers_1 = require("./file.handlers");
const structure_handlers_1 = require("./structure.handlers");
function initIpcHandlers() {
    // Реєструємо модульні обробники
    (0, user_handlers_1.registerUserHandlers)();
    (0, backup_handlers_1.registerBackupHandlers)();
    (0, log_handlers_1.registerLogHandlers)();
    (0, auth_hendlers_1.registerAuthHandlers)();
    (0, file_handlers_1.initFileHandlers)();
    (0, structure_handlers_1.registerStructureHandlers)(); // Додаємо обробники для структури
    console.log('✅ Всі IPC обробники ініціалізовано');
}
