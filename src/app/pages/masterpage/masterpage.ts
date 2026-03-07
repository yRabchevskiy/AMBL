import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import * as RouterSelectors from '../../state/selectors/router.selectors';
import { HasRoleDirective } from '../../directives/role.directive';
import { AppActions } from '../../state/actions/app.actions';
import  { selectCurrentUser } from '../../state/selectors/app.selectors';

@Component({
  selector: 'app-masterpage',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive, HasRoleDirective],
  templateUrl: './masterpage.html',
  styleUrl: './masterpage.scss',
})
export class MasterpageComponent {
  private store = inject(Store);

  // Варіант 1: Через Observable для шаблону
  currentUrl$ = this.store.select(RouterSelectors.selectUrl);

  currentUser$ = this.store.select(selectCurrentUser);
  // ngOnInit() {
  //   // Підписуємося на зміну URL через селектор
  //   this.store.select(AppSelectors.selectUrl).subscribe(url => {
  //     console.log('Поточний URL зі Store:', url);
  //     // Тут можна оновлювати стан 'app', якщо потрібно зберігати activeRoute окремо
  //   });
  // }

  logout() {
    this.store.dispatch(AppActions.logout());
  }
}
