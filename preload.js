"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel, data) => electron_1.ipcRenderer.invoke(channel, data),
    saveUser: (user) => electron_1.ipcRenderer.invoke('db-save-user', user),
    getUsers: () => electron_1.ipcRenderer.invoke('db-get-users'),
    clearAll: () => electron_1.ipcRenderer.invoke('db-clear-all'),
    getBackups: () => electron_1.ipcRenderer.invoke('get-backups-list'),
    restoreBackup: (name) => electron_1.ipcRenderer.invoke('restore-from-backup', name),
    selectFolder: () => electron_1.ipcRenderer.invoke('select-folder'),
    readDirectory: (path) => electron_1.ipcRenderer.invoke('read-directory', path),
    getStructure: (id) => electron_1.ipcRenderer.invoke('get-full-structure', id),
    createUnion: (payload) => electron_1.ipcRenderer.invoke('create-union', payload),
    moveUnion: (payload) => electron_1.ipcRenderer.invoke('move-union', payload),
    deleteStructure: (id) => electron_1.ipcRenderer.invoke('delete-structure', id),
    createStructure: (payload) => electron_1.ipcRenderer.invoke('create-structure', payload),
    addPosition: (payload) => electron_1.ipcRenderer.invoke('add-position', payload),
    deletePosition: (payload) => electron_1.ipcRenderer.invoke('delete-position', payload),
    assignUserToPosition: (payload) => electron_1.ipcRenderer.invoke('assign-user-to-position', payload),
    on: (channel, callback) => {
        electron_1.ipcRenderer.on(channel, (_event, ...args) => callback(...args));
    }
});
