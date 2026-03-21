"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simplifyObject = simplifyObject;
/**
 * Рекурсивно перетворює всі ObjectId та Buffer-подібні ID на рядки.
 * Працює з вкладеними об'єктами та масивами.
 */
function simplifyObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    // Якщо це масив, обробляємо кожен елемент
    if (Array.isArray(obj)) {
        return obj.map(simplifyObject);
    }
    // Якщо об'єкт має метод toString і це ObjectId (BSON)
    if (obj._bsontype === 'ObjectID' || (obj.constructor && obj.constructor.name === 'ObjectId')) {
        return obj.toString();
    }
    // Рекурсія для звичайних об'єктів
    const simplified = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            simplified[key] = simplifyObject(obj[key]);
        }
    }
    return simplified;
}
