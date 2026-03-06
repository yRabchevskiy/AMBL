import { createReducer, on } from '@ngrx/store';
import * as FileActions from '../actions/file.actions';

export interface FileState {
  items: any[];
  currentPath: string;
  isLoading: boolean;
  error: string | null;
}

export const initialFileState: FileState = {
  items: [],
  currentPath: '',
  isLoading: false,
  error: null
};

export const fileReducer = createReducer(
  initialFileState,
  on(FileActions.loadFiles, (state) => ({ 
    ...state, isLoading: true 
  })),
  on(FileActions.loadFilesSuccess, (state, { files, currentPath }) => ({
    ...state,
    items: files,
    currentPath: currentPath,
    isLoading: false,
    error: null
  })),
  on(FileActions.loadFilesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error
  }))
);