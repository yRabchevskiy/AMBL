import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  async saveUser(user: any) { return await window.electronAPI.saveUser(user); }
  async getUsers() { return await window.electronAPI.getUsers(); }
  

  async getStructure(id: string) { return await window.electronAPI.getStructure(id); }
  async createUnion(payload: any) { return await window.electronAPI.createUnion(payload); }
  async moveUnion(payload: any) { return await window.electronAPI.moveUnion(payload); }
  async deleteStructure(id: string) { return await window.electronAPI.deleteStructure(id); }

  async addPosition(payload: any) { return await window.electronAPI.addPosition(payload); }
  async deletePosition(payload: any) { return await window.electronAPI.deletePosition(payload); }
  async assignUserToPosition(payload: any) { return await window.electronAPI.assignUserToPosition(payload); }

  async getBackups() { return await window.electronAPI.getBackups(); }
  async clearDatabase() { return await window.electronAPI.clearAll(); }
  async restore(name: string) { return await window.electronAPI.restoreBackup(name); }

  async login(identity: string, password: string): Promise<any> {
    // Використовуємо саме electronAPI, як вказано у твоєму інтерфейсі
    return await window.electronAPI.invoke('auth-login', { identity, password });
  }
}