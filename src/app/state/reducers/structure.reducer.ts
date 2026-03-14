import { createReducer, on } from '@ngrx/store';
import { IFullStructureResponse, IStructure } from '../../models/structure.model';
import * as StructureActions from '../actions/structure.actions';

export interface IStructureState {
  allStructures: IFullStructureResponse[]; // Масив всіх структур (компаній/проєктів)
  selectedStructure: IFullStructureResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialStructureState: IStructureState = {
  allStructures: [],
  selectedStructure: null,
  loading: false,
  error: null
};

export const structureReducer = createReducer(
  initialStructureState,
  on(StructureActions.loadAllStructuresSuccess, (state, { structures }) => ({
    ...state,
    allStructures: structures,
    selectedStructure: null,
    loading: false,
    error: null
  })),

  on(StructureActions.selectAndLoadStructure, (state, { structure }) => ({
    ...state,
    selectedStructure: structure,
    loading: true,
    error: null
  })),
  on(StructureActions.loadStructure, state => ({ ...state, loading: true, error: null })),
  on(StructureActions.loadStructureSuccess, (state, { data }) => ({
    ...state,
    selectedStructure: data,
    loading: false,
    error: null
  })),
  on(StructureActions.operationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(StructureActions.createUnionSuccess, (state, { union }) => ({
    ...state,
    // unions: [...state.unions, union]
  })),

  // Найважливіший момент: оновлюємо тільки один змінений підрозділ у масиві
  on(StructureActions.updateUnionSuccess, (state, { union }) => ({
    ...state,
    // unions: state.unions.map(u => u._id === union._id ? union : u)
  })),



  on(StructureActions.deleteStructureSuccess, () => ({
    ...initialStructureState // Скидаємо все до початкового стану (unions: [], name: null, etc.)
  })),

  on(StructureActions.createStructureSuccess, (state, { structure }) => {
    return ({
      ...state,
      allStructures: [...state.allStructures, structure], // Додаємо нову структуру в список
      selectedStructure: structure,
      loading: false,
      error: null
    })
  }),

  on(StructureActions.updateStructureNameSuccess, (state, { structure }) => {
    let _selected = null;
    const _all = state.allStructures.map(s => {
      let _s = null;
      if (s._id === structure._id) {
        _s = structure;
        _selected = structure;
      } else {
        _s = s;
      }
      return _s;
    });
    return ({
      ...state,
      allStructures: _all,
      selectedStructure: _selected,
      loading: false,
      error: null
    })
  }),
);