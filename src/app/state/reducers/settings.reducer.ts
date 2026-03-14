import { createReducer, on } from '@ngrx/store';
import { IUser } from '../../models/user.model';
import { SettingsActions } from '../actions/settings.actions';

export interface IAuthState {
  currentUser: IUser | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: IAuthState = {
  currentUser: null,
  isAuthenticated: false,
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
  on(SettingsActions.login, state => ({ ...state, auth: { ...state.auth, loading: true, error: null, isAuthenticated: false } })),
  on(SettingsActions.loginSuccess, (state, { currentUser }) => ({
    ...state,
    auth: { ...state.auth, currentUser, loading: false, error: null, isAuthenticated: true }
  })),
  on(SettingsActions.loginFailure, (state, { error }) => {
    return ({
    ...state,
    auth: { ...state.auth, loading: false, error, isAuthenticated: false }
  })
  }),
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

