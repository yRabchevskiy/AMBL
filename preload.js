"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    saveUser: (user) => electron_1.ipcRenderer.invoke('db-save-user', user),
    getUsers: () => electron_1.ipcRenderer.invoke('db-get-users'),
    clearAll: () => electron_1.ipcRenderer.invoke('db-clear-all'),
    getBackups: () => electron_1.ipcRenderer.invoke('get-backups-list'),
    restoreBackup: (name) => electron_1.ipcRenderer.invoke('restore-from-backup', name),
});
