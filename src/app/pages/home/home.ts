import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { IUser } from '../../models/user.model';
import { Observable } from 'rxjs';
import { UserState } from '../../state/reducers/user.reducers';
import { Store } from '@ngrx/store';
import * as UserActions from '../../state/actions/user.actions';
import * as AuthActions from '../../state/actions/auth.actions';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  private store = inject(Store);
  // Об'єкт для форми (згідно зі схемою Mongoose)
  user = {
    name: '',
    email: '',
    role: 'user'
  };

  users$: Observable<any[]> = this.store.select(state => state.user.users);

  constructor() { }


  ngOnInit() {
    this.loadUsers();
  }

  // Отримання списку користувачів
  loadUsers() {
    // Починаємо завантаження
    this.store.dispatch(UserActions.loadUsers());
  }

  // Збереження нового користувача
  onSubmit() {
    if (this.user.name && this.user.email) {
      // Відправляємо екшен
      this.store.dispatch(UserActions.createUser({ user: this.user }));

      // Очищуємо локальну форму
      this.user = { name: '', email: '', role: 'user' };
    }
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
