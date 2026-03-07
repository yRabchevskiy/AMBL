import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IAppState } from '../state/app.state';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnDestroy {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private store = inject(Store);
  
  private destroy$ = new Subject<void>();
  private isVisible = false;

  @Input() set appHasRole(allowedRoles: string[]) {
    this.store.select((state: IAppState) => state.settings.auth.currentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        const hasRole = user && allowedRoles.includes(user.role);

        if (hasRole && !this.isVisible) {
          // Показуємо елемент
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.isVisible = true;
        } else if (!hasRole && this.isVisible) {
          // Видаляємо елемент з DOM
          this.viewContainer.clear();
          this.isVisible = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}