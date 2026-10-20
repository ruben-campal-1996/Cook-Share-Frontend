import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../../api/auth.service';
import { AuthForm, AuthFormField } from '../../shared/components/auth-form/auth-form';

@Component({
  imports: [AuthForm, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly requiresPasswordChange = signal(false);

  readonly fields = signal<AuthFormField[]>([
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      autocomplete: 'email',
      required: true,
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      autocomplete: 'current-password',
      required: true,
    },
  ]);

  onSubmit(values: Record<string, string>): void {
    const email = values['email'];
    const password = values['password'];
    if (email === undefined || password === undefined) {
      this.error.set('Introduce tu correo electrónico y contraseña.');
      return;
    }

    let request: Observable<void>;
    if (this.requiresPasswordChange()) {
      const newPassword = values['newPassword'];
      const confirmPassword = values['confirmPassword'];
      if (newPassword === undefined || confirmPassword === undefined) {
        this.error.set('Introduce y confirma tu nueva contraseña.');
        return;
      }
      if (newPassword !== confirmPassword) {
        this.error.set('Las contraseñas no coinciden.');
        return;
      }

      request = this.authService
        .changePassword(email, password, newPassword)
        .pipe(switchMap(() => this.authService.login(email, newPassword)));
    } else {
      request = this.authService.login(email, password);
    }

    this.loading.set(true);
    this.error.set(null);

    request.subscribe({
      next: () => {
        void this.router.navigateByUrl('/');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409 && !this.requiresPasswordChange()) {
          this.requiresPasswordChange.set(true);
          this.fields.set([
            ...this.fields(),
            {
              name: 'newPassword',
              label: 'Nueva contraseña',
              type: 'password',
              autocomplete: 'new-password',
              required: true,
            },
            {
              name: 'confirmPassword',
              label: 'Confirmar contraseña',
              type: 'password',
              autocomplete: 'new-password',
              required: true,
            },
          ]);
          this.error.set('Debes cambiar tu contraseña antes de iniciar sesión.');
        } else if (error.status === 401 && !this.requiresPasswordChange()) {
          this.error.set('Correo electrónico o contraseña incorrectos.');
        } else {
          console.error('Failed to authenticate', error);
          this.error.set(
            this.requiresPasswordChange()
              ? 'No se ha podido cambiar la contraseña. Inténtalo de nuevo.'
              : 'No se ha podido iniciar sesión. Inténtalo de nuevo.',
          );
        }
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
