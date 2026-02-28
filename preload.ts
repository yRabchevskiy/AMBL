import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
  saveUser: (user: any) => ipcRenderer.invoke('db-save-user', user),
  getUsers: () => ipcRenderer.invoke('db-get-users'),
  clearAll: () => ipcRenderer.invoke('db-clear-all'),

  getBackups: () => ipcRenderer.invoke('get-backups-list'),
  restoreBackup: (name: string) => ipcRenderer.invoke('restore-from-backup', name),
});