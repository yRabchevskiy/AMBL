import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { usersReducer } from './state/reducers/user.reducers';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './state/effects/user.effects';
import { AuthEffects } from './state/effects/auth.effects';
import { FileEffects } from './state/effects/file.effects';
import { filesReducer } from './state/reducers/file.reducer';
import { provideRouterStore, routerReducer } from '@ngrx/router-store'; // Імпортуй вбудований редьюсер
import { appState } from './state/app.state';
import { settingsReducer } from './state/reducers/settings.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideStore(
      { settings: settingsReducer, router: routerReducer, users: usersReducer, files: filesReducer }, // Редьюсери
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
