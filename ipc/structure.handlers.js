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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStructureHandlers = registerStructureHandlers;
const electron_1 = require("electron");
const structure_model_1 = require("../models/structure.model");
function registerStructureHandlers() {
    // --- СТРУКТУРА ---
    // Видалити всю структуру та всі її підрозділи
    electron_1.ipcMain.handle('delete-structure', (_, structureId) => __awaiter(this, void 0, void 0, function* () {
        try {
            // 1. Видаляємо всі підрозділи, пов'язані з цією структурою
            yield structure_model_1.UnionModel.deleteMany({ structureId });
            // 2. Видаляємо саму структуру
            const deleted = yield structure_model_1.StructureModel.findByIdAndDelete(structureId);
            if (!deleted) {
                return { success: false, error: 'Структуру не знайдено' };
            }
            return { success: true };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
    // Отримати всю структуру (повертає плаский масив для Angular)
    electron_1.ipcMain.handle('get-full-structure', (_, structureId) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Виконуємо запити паралельно
            const [structure, unions] = yield Promise.all([
                structure_model_1.StructureModel.findById(structureId).lean(),
                structure_model_1.UnionModel.find({ structureId })
                    .populate('positions.userId', 'name email role')
                    .lean()
            ]);
            if (!structure) {
                return { success: false, error: 'Структуру не знайдено' };
            }
            return {
                success: true,
                data: Object.assign(Object.assign({}, structure), { unions: unions // Масив підрозділів
                 })
            };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
    electron_1.ipcMain.handle('create-structure', (_, payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            const newStructure = yield structure_model_1.StructureModel.create(payload);
            return { success: true, data: newStructure };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
    // --- ПІДРОЗДІЛИ (UNIONS) ---
    // Створити підрозділ
    electron_1.ipcMain.handle('create-union', (_, payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            const newUnion = yield structure_model_1.UnionModel.create(payload);
            return { success: true, data: newUnion };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
    // --- ПОЗИЦІЇ (POSITIONS) ---
    // Додати позицію до підрозділу
    electron_1.ipcMain.handle('add-position', (_, payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield structure_model_1.UnionModel.findByIdAndUpdate(payload.unionId, { $push: { positions: { positionName: payload.positionName, userId: null } } }, { new: true });
            return { success: true, data: updated };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
    // Видалити позицію
    electron_1.ipcMain.handle('delete-position', (_, payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield structure_model_1.UnionModel.findByIdAndUpdate(payload.unionId, { $pull: { positions: { _id: payload.positionId } } }, { new: true });
            return { success: true, data: updated };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
    // Додати/змінити користувача на позиції
    electron_1.ipcMain.handle('assign-user-to-position', (_, payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield structure_model_1.UnionModel.findOneAndUpdate({ _id: payload.unionId, "positions._id": payload.positionId }, { $set: { "positions.$.userId": payload.userId } }, { new: true });
            return { success: true, data: updated };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
    // Перемістити підрозділ (змінити батька) - для Drag and Drop
    electron_1.ipcMain.handle('move-union', (_, payload) => __awaiter(this, void 0, void 0, function* () {
        try {
            const updated = yield structure_model_1.UnionModel.findByIdAndUpdate(payload.unionId, { parentId: payload.newParentId }, { new: true });
            return { success: true, data: updated };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }));
}
