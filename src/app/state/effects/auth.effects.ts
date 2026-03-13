import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { DatabaseService } from '../../services/database.service';
import { SettingsActions } from '../actions/settings.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private dbService = inject(DatabaseService);
  private router = inject(Router);

  // 1. Ефект логіну через IPC
  login$ = createEffect(() => this.actions$.pipe(
    ofType(SettingsActions.login),
    mergeMap(({ identity, password }) => {
      debugger
      return from(this.dbService.login(identity, password)).pipe(
        map(response => {
          console.log(response);
          if (response.success) {
            return SettingsActions.loginSuccess({ currentUser: response.data });
          }
          return SettingsActions.loginFailure({ error: response.error });
        }),
        catchError((err) => {
          console.dir(err);
          return of(SettingsActions.loginFailure({ error: err || 'Помилка з\'єднання з БД' }));
        })
      )
    }
    )
  ));

  // 2. Збереження в localStorage при успіху (з таймером на 2 години)
  persistUser$ = createEffect(() => this.actions$.pipe(
    ofType(SettingsActions.loginSuccess),
    tap(({ currentUser }) => {
      const expiry = Date.now() + 2 * 60 * 60 * 1000; // Поточний час + 2 години в мс
      const authData = { currentUser, expiry };
      localStorage.setItem('auth_data', JSON.stringify(authData));
      this.router.navigate(['/home']);
    })
  ), { dispatch: false });

  // 3. Ефект виходу (Logout)
  logout$ = createEffect(() => this.actions$.pipe(
    ofType(SettingsActions.logout),
    tap(() => {
      localStorage.removeItem('auth_data');
      this.router.navigate(['/login']);
    })
  ), { dispatch: false });
}