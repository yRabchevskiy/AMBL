import { createReducer, on } from '@ngrx/store';
import { IUser } from '../../models/user.model';
import { SettingsActions } from '../actions/settings.actions';

export interface IAuthState {
  currentUser: IUser | null;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: IAuthState = {
  currentUser: null,
  error: null,
  loading: false
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
  on(SettingsActions.routeChanged, (state, { url }) => ({ ...state, activeRoute: url })),
  on(SettingsActions.login, state => ({ ...state, loading: true, error: null })),
  on(SettingsActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(SettingsActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(SettingsActions.logout, () => initialSettingsState)
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

