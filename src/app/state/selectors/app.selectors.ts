import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState, ISettingsState } from '../reducers/settings.reducer';

// 'files' має збігатися з назвою в provideStore
export const selectAppState = createFeatureSelector<ISettingsState>('settings');

// Цей селектор дістає ТІЛЬКИ масив
export const selectAuth = createSelector(
  selectAppState,
  (state: ISettingsState) => {
    return state.auth || null;
  }
);

export const selectCurrentUser = createSelector(
  selectAuth,
  (state: IAuthState) => {
    return state.currentUser || null;
  }
);

export const selectUserLoading = createSelector(
  selectAuth,
  (state: IAuthState) => {
    return state.isLoading || false;
  }
);