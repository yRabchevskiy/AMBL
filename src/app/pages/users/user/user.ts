import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../state/actions/user.actions';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class UserComponent {

  private store = inject(Store);
  user = {
    name: '',
    identity: '',
    role: 'user'
  };


  onSubmit() {
    if (this.user.name && this.user.identity) {
      // Відправляємо екшен
      this.store.dispatch(UserActions.createUser({ user: this.user }));

      // Очищуємо локальну форму
      this.user = { name: '', identity: '', role: 'user' };
    }
  }
}
