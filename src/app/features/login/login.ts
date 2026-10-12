import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthForm, AuthFormField } from '../../shared/components/auth-form/auth-form';

@Component({
  imports: [AuthForm, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
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
}
