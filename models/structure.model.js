"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionModel = exports.StructureModel = void 0;
const mongoose_1 = require("mongoose");
// Схема структури (Проєкт/Компанія)
const structureSchema = new mongoose_1.Schema({
    name: { type: String, required: true }
}, { timestamps: true });
exports.StructureModel = (0, mongoose_1.model)('Structure', structureSchema);
// Схема підрозділу (Union)
const unionSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    parentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Union', default: null },
    structureId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Structure', required: true },
    positions: [{
            positionName: { type: String, required: true },
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null }
        }]
});
// Індекси для швидкості
unionSchema.index({ structureId: 1, parentId: 1 });
exports.UnionModel = (0, mongoose_1.model)('Union', unionSchema);
