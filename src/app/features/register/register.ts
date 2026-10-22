import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { AuthForm, AuthFormField } from '../../shared/components/auth-form/auth-form';

@Component({
  imports: [AuthForm, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly authService = inject(AuthService);

  readonly fields: AuthFormField[] = [
    {
      name: 'nickname',
      label: 'Nombre de usuario',
      type: 'text',
      autocomplete: 'nickname',
      required: true,
      maxLength: 60,
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'email',
      autocomplete: 'email',
      required: true,
      maxLength: 150,
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      autocomplete: 'new-password',
      required: true,
      minLength: 8,
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar contraseña',
      type: 'password',
      autocomplete: 'new-password',
      required: true,
    },
  ];

  readonly passwordMismatch = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly registered = signal(false);

  onSubmit(values: Record<string, string>): void {
    const nickname = values['nickname']?.trim();
    const email = values['email']?.trim();
    const password = values['password'];
    const confirmPassword = values['confirmPassword'];
    this.passwordMismatch.set(false);
    this.error.set(null);

    if (!nickname || !email || password === undefined || confirmPassword === undefined) {
      this.error.set('Completa todos los campos para crear tu cuenta.');
      return;
    }

    if (password !== confirmPassword) {
      this.passwordMismatch.set(true);
      return;
    }

    this.loading.set(true);
    this.authService.register(nickname, email, password).subscribe({
      next: () => this.registered.set(true),
      error: (error: HttpErrorResponse) => {
        console.error('Failed to register user', error);
        this.error.set(
          error.status === 409
            ? 'El correo electrónico o el nombre de usuario ya está en uso.'
            : 'No se ha podido crear la cuenta. Comprueba los datos e inténtalo de nuevo.',
        );
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
