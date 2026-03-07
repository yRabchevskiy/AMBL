import { createReducer, on } from '@ngrx/store';
import { AppActions } from '../actions/app.actions';
import { IUser } from '../../models/user.model';

export interface IAuthState {
  currentUser: IUser | null;
  error: string | null;
  isLoading: boolean;
}

export const initialAuthState: IAuthState = {
  currentUser: null,
  error: null,
  isLoading: false
};

export interface ISettingsState {
  activeRoute: string;
  auth: IAuthState;
}

export const initialSettingsState: ISettingsState = {
  activeRoute: '',
  auth: getInitialAuthState(),
};


export const settingsReducer = createReducer(
  initialSettingsState,
  on(AppActions.routeChanged, (state, { url }) => ({ ...state, activeRoute: url })),
  on(AppActions.login, state => ({ ...state, isLoading: true, error: null })),
  on(AppActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),
  on(AppActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(AppActions.logout, () => initialSettingsState)
);




export function getInitialAuthState(): IAuthState {
  const saved = localStorage.getItem('auth_data');
  if (!saved) return initialAuthState;

  try {
    const { user, expiry } = JSON.parse(saved);

    // Перевірка: якщо поточний час більший за час істечення — видаляємо
    if (Date.now() > expiry) {
      localStorage.removeItem('auth_data');
      return initialAuthState;
    }

    return { ...initialAuthState, currentUser: user };
  } catch {
    return initialAuthState;
  }
}

