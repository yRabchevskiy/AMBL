import { createReducer, on } from '@ngrx/store';
import { IUnion } from '../../models/structure.model';
import * as StructureActions from '../actions/structure.actions';

export interface IStructureState {
  structureId: string | null;
  name: string | null;
  unions: IUnion[];
  loading: boolean;
  error: string | null;
}

export const initialStructureState: IStructureState = {
  structureId: null,
  name: null,
  unions: [],
  loading: false,
  error: null
};

export const structureReducer = createReducer(
  initialStructureState,

  on(StructureActions.loadStructure, state => ({ ...state, loading: true })),

  on(StructureActions.loadStructureSuccess, (state, { data }) => ({
    ...state,
    structureId: data._id,
    name: data.name,
    unions: data.unions, // Беремо масив з об'єкта
    loading: false,
    error: null
  })),

  on(StructureActions.createUnionSuccess, (state, { union }) => ({
    ...state,
    unions: [...state.unions, union]
  })),

  // Найважливіший момент: оновлюємо тільки один змінений підрозділ у масиві
  on(StructureActions.updateUnionSuccess, (state, { union }) => ({
    ...state,
    unions: state.unions.map(u => u._id === union._id ? union : u)
  })),

  on(StructureActions.loadStructureFailure, StructureActions.operationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(StructureActions.deleteStructureSuccess, () => ({
    ...initialStructureState // Скидаємо все до початкового стану (unions: [], name: null, etc.)
  })),

  on(StructureActions.createStructureSuccess, (state, { structure }) => ({
    ...state,
    structureId: structure._id,
    name: structure.name,
    unions: [], // Нова структура завжди порожня
    loading: false,
    error: null
  })),

  on(StructureActions.updateStructureNameSuccess, (state, { structure }) => ({
    ...state,
    name: structure.name,
    loading: false
  })),

  on(StructureActions.operationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);