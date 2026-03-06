import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FileState } from '../reducers/file.reducer';

// 'files' має збігатися з назвою в provideStore
export const selectFileState = createFeatureSelector<FileState>('files');

// Цей селектор дістає ТІЛЬКИ масив
export const selectAllFiles = createSelector(
  selectFileState,
  (state: FileState) => {
    debugger
    return state.items || []; // Повертає Array, що і треба для *ngFor
  } // Повертає Array, що і треба для *ngFor
);

export const selectIsLoading = createSelector(
  selectFileState,
  (state: FileState) => state.isLoading
);