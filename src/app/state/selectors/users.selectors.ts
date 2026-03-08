import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IUsersState } from "../reducers/users.reducers";

export const selectUsersState = createFeatureSelector<IUsersState>('users');

// Цей селектор дістає ТІЛЬКИ масив
export const selectAllUsers = createSelector(
  selectUsersState,
  (state: IUsersState) => {
    return state.users || []; // Повертає Array, що і треба для *ngFor
  } // Повертає Array, що і треба для *ngFor
);

export const selectIsLoading = createSelector(
  selectUsersState,
  (state: IUsersState) => state.loading
);