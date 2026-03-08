import { routerReducer } from "@ngrx/router-store";
import { filesReducer, FilesState, initialFilesState } from "./reducers/file.reducer";
import { initialSettingsState, ISettingsState, settingsReducer } from "./reducers/settings.reducer";
import { initialUsersState, IUsersState, usersReducer } from "./reducers/users.reducers";

export interface IAppState {
  settings: ISettingsState;
  router: any;
  users: IUsersState;
  files: FilesState;
}
export const appState: IAppState = {
  settings: initialSettingsState,
  router: undefined,
  users: initialUsersState,
  files: initialFilesState,
};


export const appReducers = {
  router: routerReducer,
  settings: settingsReducer,
  users: usersReducer,
  files: filesReducer
}