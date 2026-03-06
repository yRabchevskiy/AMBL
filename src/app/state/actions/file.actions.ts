import { createAction, props } from '@ngrx/store';

export const loadFiles = createAction(
  '[Explorer] Load Files',
  props<{ path: string }>()
);

export const loadFilesSuccess = createAction(
  '[Explorer] Load Files Success',
  props<{ files: any[], currentPath: string }>()
);

export const loadFilesFailure = createAction(
  '[Explorer] Load Files Failure',
  props<{ error: string }>()
);