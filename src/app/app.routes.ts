import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin';
import { HomeComponent } from './pages/home/home';
import { authGuard } from './services/auth.guard';
import { LoginComponent } from './pages/login/login';
import { ExplorerComponent } from './pages/explorer/explorer';
import { MasterpageComponent } from './pages/masterpage/masterpage';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MasterpageComponent,
    canActivate: [authGuard], // Не пустить без юзера в Store
    children: [
      {
        path: 'home', component: HomeComponent, children: [
          { path: 'explorer', component: ExplorerComponent } // Вкладений роут
        ]
      }, // Дефолтная страница внутри /home
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
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
