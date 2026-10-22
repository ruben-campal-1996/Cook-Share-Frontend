import { Component, input, output } from '@angular/core';
import { AppButton } from '../button/app-button';

export interface AuthFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  autocomplete?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

@Component({
  imports: [AppButton],
  selector: 'app-auth-form',
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm {
  readonly title = input.required<string>();
  readonly fields = input.required<AuthFormField[]>();
  readonly submitLabel = input.required<string>();
  readonly disabled = input(false);

  readonly submitted = output<Record<string, string>>();

  onSubmit(event: SubmitEvent, form: HTMLFormElement): void {
    event.preventDefault();
    if (this.disabled()) {
      return;
    }

    const formData = new FormData(form);
    const values: Record<string, string> = {};

    for (const field of this.fields()) {
      const value = formData.get(field.name);
      if (typeof value !== 'string') {
        throw new Error(`No string value found for auth form field "${field.name}".`);
      }
      values[field.name] = value;
    }

    this.submitted.emit(values);
  }
}
