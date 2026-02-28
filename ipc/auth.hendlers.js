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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAuthHandlers = registerAuthHandlers;
const bcrypt_1 = __importDefault(require("bcrypt"));
const electron_1 = require("electron");
const user_model_1 = require("../models/user.model");
function registerAuthHandlers() {
    electron_1.ipcMain.handle('auth-login', (event_1, _a) => __awaiter(this, [event_1, _a], void 0, function* (event, { email, password }) {
        try {
            const user = yield user_model_1.User.findOne({ email }).lean();
            if (!user)
                return { success: false, error: 'Користувача не знайдено' };
            const match = yield bcrypt_1.default.compare(password, user.password);
            if (!match)
                return { success: false, error: 'Невірний пароль' };
            const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
            return { success: true, data: userWithoutPassword };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
}
