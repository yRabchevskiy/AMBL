import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { IAppState } from './state/app.state';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  standalone: true
})
export class App {
  private store = inject(Store);
  private router = inject(Router);
  ngOnInit() {
    // Перевіряємо, чи є залогінений юзер у стані
    this.store.select((state: IAppState) => state.settings.auth?.currentUser)
      .pipe(take(1))
      .subscribe(user => {
        if (!user) {
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/home']);
        }
      });
  }
}
