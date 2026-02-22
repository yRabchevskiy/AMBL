import { Schema, model } from 'mongoose';

// Описуємо структуру документа
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  version: { type: Number, default: 1 }, // Поле для відстеження версії схеми
  createdAt: { type: Date, default: Date.now }
});

export const User = model('User', userSchema);