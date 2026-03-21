import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
  saveUser: (user: any) => ipcRenderer.invoke('db-save-user', user),
  getUsers: () => ipcRenderer.invoke('db-get-users'),
  clearAll: () => ipcRenderer.invoke('db-clear-all'),

  getBackups: () => ipcRenderer.invoke('get-backups-list'),
  restoreBackup: (name: string) => ipcRenderer.invoke('restore-from-backup', name),

  selectFolder: () => ipcRenderer.invoke('select-folder'),
  readDirectory: (path: string) => ipcRenderer.invoke('read-directory', path),


  getAllStructures: () => ipcRenderer.invoke('get-all-structures'),
  getStructure: (id: string) => ipcRenderer.invoke('get-full-structure', id),
  deleteStructure: (id: string) => ipcRenderer.invoke('delete-structure', id),
  createStructure: (payload: any) => ipcRenderer.invoke('create-structure', payload),

  // Підрозділи (Unions)
  createUnion: (payload: any) => ipcRenderer.invoke('create-union', payload),
  updateUnion: (payload: any) => ipcRenderer.invoke('update-union', payload), // Додано
  deleteUnion: (id: string) => ipcRenderer.invoke('delete-union', id),       // Додано
  moveUnion: (payload: any) => ipcRenderer.invoke('move-union', payload),
  
  addPosition: (payload: any) => ipcRenderer.invoke('add-position', payload),
  deletePosition: (payload: any) => ipcRenderer.invoke('delete-position', payload),
  assignUserToPosition: (payload: any) => ipcRenderer.invoke('assign-user-to-position', payload),

  on: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  }
});