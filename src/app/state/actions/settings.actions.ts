import { createAction, props } from '@ngrx/store';
import { IUser } from '../../models/user.model';

const routeChanged = createAction(
  '[App] Route Changed',
  props<{ url: string }>()
);

const login = createAction('[Settings] Login', props<{ identity: string, password: string }>());
const loginSuccess = createAction('[Settings] Login Success', props<{ currentUser: IUser }>());
const loginFailure = createAction('[Settings] Login Failure', props<{ error: string }>());

const logout = createAction('[Settings] Logout');


export const SettingsActions = {
  routeChanged,
  login,
  loginSuccess,
  loginFailure,
  logout
}