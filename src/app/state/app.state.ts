import { FilesState, initialFilesState } from "./reducers/file.reducer";
import { initialSettingsState, ISettingsState } from "./reducers/settings.reducer";
import { initialUsersState, UsersState } from "./reducers/user.reducers";

export interface IAppState {
  settings: ISettingsState;
  router: any;
  users: UsersState;
  files: FilesState;
}
export const appState: IAppState = {
  settings: initialSettingsState,
  router: undefined,
  users: initialUsersState,
  files: initialFilesState,
};
