import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { SettingsActions } from '../../state/actions/settings.actions';
import { selectCurrentUserError, selectCurrentUserLoading } from '../../state/selectors/settings.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  showPassword = false;

  loginForm: FormGroup = this.fb.group({
    identity: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(1)]]
  });

  // Підписуємось на стан помилок та завантаження зі стору
  error$ = this.store.select(selectCurrentUserError);
  isLoading$ = this.store.select(selectCurrentUserLoading);

  onShowPasswordToggle() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { identity, password } = this.loginForm.value;
      this.store.dispatch(SettingsActions.login({ identity, password }));
    }
  }
}