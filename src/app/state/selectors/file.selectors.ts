import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilesState } from '../reducers/file.reducer';

// 'files' має збігатися з назвою в provideStore
export const selectFileState = createFeatureSelector<FilesState>('files');

// Цей селектор дістає ТІЛЬКИ масив
export const selectAllFiles = createSelector(
  selectFileState,
  (state: FilesState) => {
    return state.items || []; // Повертає Array, що і треба для *ngFor
  } // Повертає Array, що і треба для *ngFor
);

export const selectIsLoading = createSelector(
  selectFileState,
  (state: FilesState) => state.isLoading
);