import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select((state: any) => state.auth.user).pipe(
    take(1),
    map(user => user ? true : router.createUrlTree(['/login']))
  );
};