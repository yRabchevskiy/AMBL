import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  private store = inject(Store);
  private router = inject(Router);
  ngOnInit() {
    // Перевіряємо, чи є залогінений юзер у стані
    this.store.select(state => (state as any).auth.user)
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
