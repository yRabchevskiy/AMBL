import mongoose, { Schema, model } from 'mongoose';

// Описуємо структуру документа
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Нове поле
  role: { type: String, default: 'USER' }
});

const UserRoles = ['USER', 'ADMIN', 'MODERATOR']; // Дозволені ролі

// Додаємо валідацію для ролі
UserSchema.path('role').validate(function(value) {
  return UserRoles.includes(value);
}, 'Invalid role');

export const User = model('User', UserSchema);