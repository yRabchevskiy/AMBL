interface Window {
  electronAPI: {
    saveUser: (user: any) => Promise<any>;
    getUsers: () => Promise<any[]>;
    clearAll: () => Promise<any>;

    getBackups: () => Promise<string[]>;
    restoreBackup: (name: string) => Promise<any>;

    invoke: (channel: string, ...args: any[]) => Promise<any>;
    on: (channel: string, func: (...args: any[]) => void) => void;
  };
}