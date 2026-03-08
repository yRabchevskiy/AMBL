import { createAction, props } from '@ngrx/store';

const routeChanged = createAction(
  '[App] Route Changed',
  props<{ url: string }>()
);

const login = createAction('[Auth] Login', props<{ email: string, password: string }>());
const loginSuccess = createAction('[Auth] Login Success', props<{ user: any }>());
const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

const logout = createAction('[Auth] Logout');


export const SettingsActions = {
  routeChanged,
  login,
  loginSuccess,
  loginFailure,
  logout
}