import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as UserActions from '../../state/actions/user.actions';
import { CommonModule } from '@angular/common';
import { selectAllUsers } from '../../state/selectors/users.selectors';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersComponent implements OnInit {
  private store = inject(Store);

  users$: Observable<any[]> = this.store.select(selectAllUsers);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.store.dispatch(UserActions.loadUsers());
  }
}
