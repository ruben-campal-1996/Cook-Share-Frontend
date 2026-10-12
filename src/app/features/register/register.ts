import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthForm, AuthFormField } from '../../shared/components/auth-form/auth-form';

@Component({
  imports: [AuthForm, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
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
  ];

  readonly passwordMismatch = signal(false);

  onSubmit(values: Record<string, string>): void {
    this.passwordMismatch.set(values['password'] !== values['confirmPassword']);
  }
}
