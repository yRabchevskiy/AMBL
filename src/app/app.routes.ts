import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin';
import { HomeComponent } from './pages/home/home';
import { authGuard } from './services/auth.guard';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [authGuard] // Не пустить без юзера в Store
  },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [authGuard] // Не пустить без юзера в Store
  },
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'home' 
  }
];
