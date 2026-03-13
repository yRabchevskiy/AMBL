import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './state/effects/user.effects';
import { AuthEffects } from './state/effects/auth.effects';
import { FileEffects } from './state/effects/file.effects';
import { provideRouterStore } from '@ngrx/router-store'; // Імпортуй вбудований редьюсер
import { appReducers, appState } from './state/app.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideStore(
      appReducers, // Редьюсери
      {
        initialState: appState,
        runtimeChecks: {
          strictStateImmutability: false, // Вимикаємо сувору перевірку для стану
          strictActionImmutability: false, // Вимикаємо сувору перевірку для екшенів
        }
      }
    ),
    provideRouterStore(),
    provideEffects([UserEffects, AuthEffects, FileEffects]),

    // Підключаємо Redux DevTools (дуже корисно для дебагу в Chrome/Electron)
    provideStoreDevtools({
      maxAge: 25, // зберігати останні 25 станів
      logOnly: !isDevMode(),
      connectInZone: true, // ВАЖЛИВО для Electron: тримає зв'язок з зоною Angular
      name: 'AMBL DevTools',
      serialize: {
        options: {
          undefined: true,
          // Це дозволить DevTools ігнорувати типи, які він не може серіалізувати/заморозити
          map: true,
          set: true,
          error: true
        }
      }
    })
  ]
};
