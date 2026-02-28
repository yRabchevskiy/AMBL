import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';

export interface AuthState {
  user: any | null;
  error: string | null;
  isLoading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  error: null,
  isLoading: false
};

export function getInitialAuthState(): AuthState {
  const saved = localStorage.getItem('auth_data');
  if (!saved) return initialAuthState;

  try {
    const { user, expiry } = JSON.parse(saved);
    
    // Перевірка: якщо поточний час більший за час істечення — видаляємо
    if (Date.now() > expiry) {
      localStorage.removeItem('auth_data');
      return initialAuthState;
    }
    
    return { ...initialAuthState, user };
  } catch {
    return initialAuthState;
  }
}

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, state => ({ ...state, isLoading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { user }) => ({ 
    ...state, 
    user, 
    isLoading: false, 
    error: null 
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({ 
    ...state, 
    isLoading: false, 
    error 
  })),
  on(AuthActions.logout, () => initialAuthState)
);