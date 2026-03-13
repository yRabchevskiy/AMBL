import { routerReducer } from "@ngrx/router-store";
import { filesReducer, FilesState, initialFilesState } from "./reducers/file.reducer";
import { initialSettingsState, ISettingsState, settingsReducer } from "./reducers/settings.reducer";
import { initialUsersState, IUsersState, usersReducer } from "./reducers/users.reducers";
import { initialStructureState, IStructureState, structureReducer } from "./reducers/structure.reducer";

export interface IAppState {
  settings: ISettingsState;
  router: any;
  users: IUsersState;
  files: FilesState;
  structure: IStructureState;
}
export const appState: IAppState = {
  settings: initialSettingsState,
  router: undefined,
  users: initialUsersState,
  files: initialFilesState,
  structure: initialStructureState 
};


export const appReducers = {
  router: routerReducer,
  settings: settingsReducer,
  users: usersReducer,
  files: filesReducer,
  structure: structureReducer,

}