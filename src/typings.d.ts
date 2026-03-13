interface Window {
  electronAPI: {
    // Користувачі
    saveUser: (user: any) => Promise<any>;
    getUsers: () => Promise<any[]>;

    // Структура
    getStructure: (structureId: string) => Promise<any>;
    createUnion: (payload: { name: string, parentId: string | null, structureId: string }) => Promise<any>;
    moveUnion: (payload: { unionId: string, newParentId: string | null }) => Promise<any>;
    deleteStructure: (structureId: string) => Promise<any>;
    createStructure: (payload: { name: string }) => Promise<any>;

    // Позиції
    addPosition: (payload: { unionId: string, positionName: string }) => Promise<any>;
    deletePosition: (payload: { unionId: string, positionId: string }) => Promise<any>;
    assignUserToPosition: (payload: { unionId: string, positionId: string, userId: string | null }) => Promise<any>;

    // Система
    clearAll: () => Promise<any>;
    getBackups: () => Promise<string[]>;
    restoreBackup: (name: string) => Promise<any>;

    selectFolder: () => Promise<string | null>;
    readDirectory: (path: string) => Promise<any[]>;

    invoke: (channel: string, ...args: any[]) => Promise<any>;
    on: (channel: string, func: (...args: any[]) => void) => void;
  };
}