import { Schema, model, Types } from 'mongoose';

// Схема структури (Проєкт/Компанія)
const structureSchema = new Schema({
  name: { type: String, required: true, trim: true }
}, { timestamps: true });

export const StructureModel = model('Structure', structureSchema);

// Схема підрозділу (Union)
const unionSchema = new Schema({
  name: { type: String, required: true },
  parentId: { type: Schema.Types.ObjectId, ref: 'Union', default: null },
  structureId: { type: Schema.Types.ObjectId, ref: 'Structure', required: true },
  positions: [{
    positionName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null }
  }]
});

// Індекси для швидкості
unionSchema.index({ structureId: 1, parentId: 1 });

export const UnionModel = model('Union', unionSchema);