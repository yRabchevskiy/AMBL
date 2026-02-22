import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent {
  users: any[] = [];

  backups: any[] = [];

  constructor(private dbService: DatabaseService) { }

  async ngOnInit() {
    await this.loadUsers();
    await this.loadBackups();
  }

  async loadUsers() {
    this.users = await this.dbService.getUsers();
    console.log(this.users)
  }

  async loadBackups() {
    this.backups = await this.dbService.getBackups();
    console.log(this.backups)
  }

  async clearAll() {
    if (confirm('Ви впевнені, що хочете видалити всі дані?')) {
      await this.dbService.clearDatabase();
      await this.loadUsers();
    }
  }

  async restore(name: string) {
    const confirmRestore = confirm('Увага! Поточні дані будуть замінені, а додаток перезапуститься. Продовжити?');
    if (confirmRestore) {
      const result = await this.dbService.restore(name);
      if (!result.success) {
        alert('Помилка відновлення: ' + result.error);
      }
    }
  }
}
