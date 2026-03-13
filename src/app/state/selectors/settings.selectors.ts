import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState, ISettingsState } from '../reducers/settings.reducer';

// 'files' має збігатися з назвою в provideStore
export const selectSettingsState = createFeatureSelector<ISettingsState>('settings');

export const selectAuth = createSelector(
  selectSettingsState,
  (state: ISettingsState) => {
    return state.auth || null;
  }
);


// CurrentUser
export const selectCurrentUser = createSelector(
  selectAuth,
  (authState: IAuthState) => {
    return authState?.currentUser || null;
  }
);

export const selectCurrentUserLoading = createSelector(
  selectAuth,
  (authState: IAuthState) => {
    return authState?.loading || false;
  }
);

export const selectCurrentUserError = createSelector(
  selectAuth,
  (authState: IAuthState) => {
    return authState?.error || null;
  }
);