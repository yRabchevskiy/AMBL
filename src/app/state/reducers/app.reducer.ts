import { createReducer, on } from '@ngrx/store';
import * as AppActions from '../actions/app.actions';

export interface AppState {
  activeRoute: string;
  // ... інші поля
}

export const initialAppState: AppState = {
  activeRoute: ''
};


export const appReducer = createReducer(
  initialAppState,
  on(AppActions.routeChanged, (state, { url }) => ({ ...state, activeRoute: url }))
);