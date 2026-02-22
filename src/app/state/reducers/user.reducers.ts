import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';

export interface UserState {
  users: any[];
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUsers, state => ({ ...state, loading: true })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: [...users], // Створюємо нове посилання
    loading: false
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [user, ...state.users], // Додаємо нового юзера на початок списку
    loading: false
  })),
);