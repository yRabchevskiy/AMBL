import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
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

  // --- НОВИЙ ЕФЕКТ: Відновлення сесії при старті ---
  initAuth$ = createEffect(() => this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT), // Спрацьовує один раз при запуску додатка
    map(() => {
      const data = localStorage.getItem('auth_data');
      if (!data) return SettingsActions.logout();

      const { currentUser, expiry } = JSON.parse(data);

      // Перевіряємо, чи не протермінована сесія (2 години)
      if (Date.now() > expiry) {
        return SettingsActions.logout();
      }

      // Якщо все ок, повертаємо успішний логін у стейт
      return SettingsActions.loginSuccess({ currentUser });
    })
  ));
  
  // 1. Ефект логіну через IPC
  // --- Твій існуючий логін ---
  login$ = createEffect(() => this.actions$.pipe(
    ofType(SettingsActions.login),
    mergeMap(({ identity, password }) => 
      from(this.dbService.login(identity, password)).pipe(
        map(response => {
          if (response.success) {
            return SettingsActions.loginSuccess({ currentUser: response.data });
          }
          return SettingsActions.loginFailure({ error: response.error });
        }),
        catchError((err) => of(SettingsActions.loginFailure({ error: err.message || 'Помилка БД' })))
      )
    )
  ));

  // --- Твій ефект збереження (додано логіку перенаправлення тільки при ручному логіні) ---
  persistUser$ = createEffect(() => this.actions$.pipe(
    ofType(SettingsActions.loginSuccess),
    tap(({ currentUser }) => {
      // Зберігаємо лише якщо даних ще немає або вони змінилися
      const expiry = Date.now() + 2 * 60 * 60 * 1000;
      localStorage.setItem('auth_data', JSON.stringify({ currentUser, expiry }));
      
      // Перенаправляємо на home, ТІЛЬКИ якщо ми зараз на сторінці логіну
      if (this.router.url === '/login') {
        this.router.navigate(['/home']);
      }
    })
  ), { dispatch: false });

  // --- Твій ефект виходу ---
  logout$ = createEffect(() => this.actions$.pipe(
    ofType(SettingsActions.logout),
    tap(() => {
      localStorage.removeItem('auth_data');
      this.router.navigate(['/login']);
    })
  ), { dispatch: false });
}