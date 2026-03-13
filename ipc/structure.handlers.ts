import { ipcMain } from "electron";
import { StructureModel, UnionModel } from "../models/structure.model";

export function registerStructureHandlers() {
  // --- СТРУКТУРА ---

  // Видалити всю структуру та всі її підрозділи
  ipcMain.handle('delete-structure', async (_, structureId: string) => {
    try {
      // 1. Видаляємо всі підрозділи, пов'язані з цією структурою
      await UnionModel.deleteMany({ structureId });

      // 2. Видаляємо саму структуру
      const deleted = await StructureModel.findByIdAndDelete(structureId);

      if (!deleted) {
        return { success: false, error: 'Структуру не знайдено' };
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // Отримати всю структуру (повертає плаский масив для Angular)
  ipcMain.handle('get-full-structure', async (_, structureId: string) => {
    try {
      // Виконуємо запити паралельно
      const [structure, unions] = await Promise.all([
        StructureModel.findById(structureId).lean(),
        UnionModel.find({ structureId })
          .populate('positions.userId', 'name email role')
          .lean()
      ]);

      if (!structure) {
        return { success: false, error: 'Структуру не знайдено' };
      }

      return {
        success: true,
        data: {
          ...structure, // Тут будуть _id, name, createdAt
          unions: unions // Масив підрозділів
        }
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('create-structure', async (_, payload: { name: string }) => {
    try {
      const newStructure = await StructureModel.create(payload);
      return { success: true, data: newStructure };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('update-structure-name', async (_, payload: { structureId: string, name: string }) => {
    try {
      const updated = await StructureModel.findByIdAndUpdate(
        payload.structureId,
        { name: payload.name },
        { new: true } // Повертає вже оновлений об'єкт
      ).lean();

      return { success: true, data: updated };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // --- ПІДРОЗДІЛИ (UNIONS) ---

  // Створити підрозділ
  ipcMain.handle('create-union', async (_, payload: { name: string, parentId: string | null, structureId: string }) => {
    try {
      const newUnion = await UnionModel.create(payload);
      return { success: true, data: newUnion };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // --- ПОЗИЦІЇ (POSITIONS) ---

  // Додати позицію до підрозділу
  ipcMain.handle('add-position', async (_, payload: { unionId: string, positionName: string }) => {
    try {
      const updated = await UnionModel.findByIdAndUpdate(
        payload.unionId,
        { $push: { positions: { positionName: payload.positionName, userId: null } } },
        { new: true }
      );
      return { success: true, data: updated };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // Видалити позицію
  ipcMain.handle('delete-position', async (_, payload: { unionId: string, positionId: string }) => {
    try {
      const updated = await UnionModel.findByIdAndUpdate(
        payload.unionId,
        { $pull: { positions: { _id: payload.positionId } } },
        { new: true }
      );
      return { success: true, data: updated };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // Додати/змінити користувача на позиції
  ipcMain.handle('assign-user-to-position', async (_, payload: { unionId: string, positionId: string, userId: string | null }) => {
    try {
      const updated = await UnionModel.findOneAndUpdate(
        { _id: payload.unionId, "positions._id": payload.positionId },
        { $set: { "positions.$.userId": payload.userId } },
        { new: true }
      );
      return { success: true, data: updated };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // Перемістити підрозділ (змінити батька) - для Drag and Drop
  ipcMain.handle('move-union', async (_, payload: { unionId: string, newParentId: string | null }) => {
    try {
      const updated = await UnionModel.findByIdAndUpdate(
        payload.unionId,
        { parentId: payload.newParentId },
        { new: true }
      );
      return { success: true, data: updated };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

}