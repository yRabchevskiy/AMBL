import { createAction, props } from '@ngrx/store';

export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: any[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());

export const createUser = createAction(
  '[User] Create User',
  props<{ user: any }>()
);

export const createUserSuccess = createAction(
  '[User] Create User Success',
  props<{ user: any }>()
);

export const createUserFailure = createAction(
  '[User] Create User Failure',
  props<{ error: string }>()
);