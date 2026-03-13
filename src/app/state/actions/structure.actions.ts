import { createAction, props } from '@ngrx/store';
import { IFullStructureResponse, IStructure, IUnion } from '../../models/structure.model';

// Завантаження даних
export const loadStructure = createAction('[Structure] Load', props<{ structureId: string }>());
export const loadStructureSuccess = createAction('[Structure] Load Success', props<{ data: IFullStructureResponse }>());
export const loadStructureFailure = createAction('[Structure] Load Failure', props<{ error: string }>());

export const deleteStructure = createAction(
  '[Structure] Delete',
  props<{ structureId: string }>()
);

export const createStructure = createAction(
  '[Structure] Create', 
  props<{ name: string }>()
);

export const createStructureSuccess = createAction(
  '[Structure] Create Success', 
  props<{ structure: IStructure }>()
);


export const deleteStructureSuccess = createAction(
  '[Structure] Delete Success'
);
export const deleteStructureFailure = createAction(
  '[Structure] Delete Failure',
  props<{ error: string }>()
);

export const updateStructureName = createAction(
  '[Structure] Update Name',
  props<{ structureId: string, name: string }>()
);

export const updateStructureNameSuccess = createAction(
  '[Structure] Update Name Success',
  props<{ structure: any }>()
);

// Підрозділи (Unions)
export const createUnion = createAction('[Structure] Create Union', props<{ payload: { name: string, parentId: string | null, structureId: string } }>());
export const createUnionSuccess = createAction('[Structure] Create Union Success', props<{ union: IUnion }>());

export const moveUnion = createAction('[Structure] Move Union', props<{ unionId: string, newParentId: string | null }>());

// Позиції та Користувачі
export const addPosition = createAction('[Structure] Add Position', props<{ unionId: string, positionName: string }>());
export const deletePosition = createAction('[Structure] Delete Position', props<{ unionId: string, positionId: string }>());
export const assignUser = createAction('[Structure] Assign User', props<{ unionId: string, positionId: string, userId: string | null }>());

// Універсальне оновлення одного підрозділу в стейті
export const updateUnionSuccess = createAction('[Structure] Update Union Success', props<{ union: IUnion }>());

// Помилки операцій
export const operationFailure = createAction('[Structure] Operation Failure', props<{ error: string }>());