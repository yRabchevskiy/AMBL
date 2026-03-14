import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IStructureState } from '../reducers/structure.reducer';

// Селектор, який будує дерево (рекурсивно)
export const selectStructureState = createFeatureSelector<IStructureState>('structure');

export const selectAllAvailableStructures = createSelector(
  selectStructureState,
  (state) => state.allStructures
);


export const selectSelectedStructure = createSelector(
  selectStructureState,
  (state) => state.selectedStructure
);
// Базовий селектор для всіх підрозділів (плаский масив)
export const selectAllUnions = createSelector(
  selectSelectedStructure,
  (selectedStructure) => selectedStructure?.unions || []
);

export const selectStructureLoading = createSelector(
  selectStructureState,
  state => state.loading
);

// Магія: Перетворення плаского масиву в дерево
export const selectStructureTree = createSelector(
  selectAllUnions,
  (unions) => {
    if (!unions || unions.length === 0) return [];

    const map = new Map<string, any>();
    const tree: any[] = [];

    // 1. Створюємо карту об'єктів (копіюємо, щоб не мутувати стейт)
    unions.forEach(u => {
      map.set(u._id, { ...u, children: [] });
    });

    // 2. Будуємо ієрархію
    unions.forEach(u => {
      const node = map.get(u._id);
      if (u.parentId && map.has(u.parentId)) {
        map.get(u.parentId).children.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  }
);

