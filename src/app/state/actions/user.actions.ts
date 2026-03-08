import { createAction, props } from '@ngrx/store';
import { IUser } from '../../models/user.model';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: IUser[] }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: string }>());

export const createUser = createAction(
  '[Users] Create User',
  props<{ user: IUser }>()
);

export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{ user: IUser }>()
);

export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ error: string }>()
);