import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { LoginComponent } from './pages/login/login';
import { MasterpageComponent } from './pages/masterpage/masterpage';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MasterpageComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
      },
      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] } // Тільки для адмінів
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users').then(m => m.UsersComponent),
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'MODERATOR'] } // Для адмінів та модераторів
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
