import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { IAppState } from '../state/app.state';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select((state: IAppState) => state.settings.auth.currentUser).pipe(
    take(1),
    map(user => {
      // 1. Якщо юзера немає — на логін
      if (!user) {
        return router.createUrlTree(['/login']);
      }

      // 2. Отримуємо список дозволених ролей для цього роута
      const allowedRoles = route.data['roles'] as Array<string>;

      // 3. Якщо ролі не вказані — пускаємо всіх авторизованих
      if (!allowedRoles || allowedRoles.length === 0) {
        return true;
      }

      // 4. Перевіряємо, чи є роль юзера у списку дозволених
      const hasRole = allowedRoles.includes(user.role);

      if (hasRole) {
        return true;
      } else {
        // Якщо роль не підходить — редірект на головну (або сторінку 403)
        console.warn('Access denied: Insufficient permissions');
        return router.createUrlTree(['/home']);
      }
    })
  );
};