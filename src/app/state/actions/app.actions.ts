import { createAction, props } from '@ngrx/store';

export const routeChanged = createAction(
  '[App] Route Changed',
  props<{ url: string }>()
);