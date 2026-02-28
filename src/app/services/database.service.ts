import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  async saveUser(user: any) { return await window.electronAPI.saveUser(user); }
  async getUsers() { return await window.electronAPI.getUsers(); }
  async clearDatabase() { return await window.electronAPI.clearAll(); }


  async getBackups() { return await window.electronAPI.getBackups(); }
  async restore(name: string) { return await window.electronAPI.restoreBackup(name); }

  async login(email: string, password: string): Promise<any> {
    // Використовуємо саме electronAPI, як вказано у твоєму інтерфейсі
    return await window.electronAPI.invoke('auth-login', { email, password });
  }
}