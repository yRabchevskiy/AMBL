import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: any[] }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: string }>());

export const createUser = createAction(
  '[Users] Create User',
  props<{ user: any }>()
);

export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: any }>()
);

export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: string }>()
);