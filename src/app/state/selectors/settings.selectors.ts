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


// CurrentUser
export const selectCurrentUser = createSelector(
  selectAuth,
  (state: IAuthState) => {
    return state.currentUser || null;
  }
);

export const selectCurrentUserLoading = createSelector(
  selectAuth,
  (state: IAuthState) => {
    return state.loading || false;
  }
);

export const selectCurrentUserError = createSelector(
  selectAuth,
  (state: IAuthState) => {
    return state.error || null;
  }
);