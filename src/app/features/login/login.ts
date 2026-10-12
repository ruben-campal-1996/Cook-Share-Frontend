import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  readonly fields: AuthFormField[] = [
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
  ];

  onSubmit(values: Record<string, string>): void {
    const email = values['email'];
    const password = values['password'];
    if (email === undefined || password === undefined) {
      this.error.set('Introduce tu correo electrónico y contraseña.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(email, password).subscribe({
      next: () => {
        void this.router.navigateByUrl('/');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.error.set('Correo electrónico o contraseña incorrectos.');
        } else if (error.status === 409) {
          this.error.set('Debes cambiar tu contraseña antes de iniciar sesión.');
        } else {
          console.error('Failed to log in', error);
          this.error.set('No se ha podido iniciar sesión. Inténtalo de nuevo.');
        }
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
