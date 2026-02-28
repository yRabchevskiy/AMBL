import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { initialUserState, userReducer } from './state/reducers/user.reducers';
import { provideEffects } from '@ngrx/effects';
import { UserEffects } from './state/effects/user.effects';
import { authReducer, getInitialAuthState } from './state/reducers/auth.reducer';
import { AuthEffects } from './state/effects/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideStore(
      { user: userReducer, auth: authReducer }, // Редьюсери
      {
        initialState: {
          user: initialUserState, // Передаємо початковий стан для гілки 'user'
          auth: getInitialAuthState()
        },
        runtimeChecks: {
          strictStateImmutability: false, // Вимикаємо сувору перевірку для стану
          strictActionImmutability: false, // Вимикаємо сувору перевірку для екшенів
        }
      }
    ),
    provideEffects([UserEffects, AuthEffects]),

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
