interface Window {
  electronAPI: {
    saveUser: (user: any) => Promise<any>;
    getUsers: () => Promise<any[]>;
    clearAll: () => Promise<any>;

    getBackups: () => Promise<string[]>;
    restoreBackup: (name: string) => Promise<any>;
  };
}