import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
