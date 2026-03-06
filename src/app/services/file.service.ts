import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileService {
  async selectFolder() {
    return await window.electronAPI.selectFolder();
  }

  async getFiles(path: string) {
    return await window.electronAPI.readDirectory(path);
  }
}