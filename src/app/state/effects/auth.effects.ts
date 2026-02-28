import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { DatabaseService } from '../../services/database.service';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private dbService = inject(DatabaseService);
  private router = inject(Router);

  // 1. Ефект логіну через IPC
  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.login),
    mergeMap(({ email, password }) => {
      debugger
      return from(this.dbService.login(email, password)).pipe(
        map(response => {
          if (response.success) {
            return AuthActions.loginSuccess({ user: response.data });
          }
          return AuthActions.loginFailure({ error: response.error });
        }),
        catchError((err) => {
          console.dir(err);
          return of(AuthActions.loginFailure({ error: err || 'Помилка з\'єднання з БД' }));
        })
      )
    }
    )
  ));

  // 2. Збереження в localStorage при успіху (з таймером на 2 години)
  persistUser$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(({ user }) => {
      const expiry = Date.now() + 2 * 60 * 60 * 1000; // Поточний час + 2 години в мс
      const authData = { user, expiry };
      localStorage.setItem('auth_data', JSON.stringify(authData));
      this.router.navigate(['/home']);
    })
  ), { dispatch: false });

  // 3. Ефект виходу (Logout)
  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      localStorage.removeItem('auth_data');
      this.router.navigate(['/login']);
    })
  ), { dispatch: false });
}