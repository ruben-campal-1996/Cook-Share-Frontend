import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'transparent' | 'green' | 'red' | 'yellow';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  imports: [NgClass],
  selector: 'app-button',
  templateUrl: './app-button.html',
})
export class AppButton {
  readonly label = input.required<string>();
  readonly type = input<ButtonType>('button');
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input(false);
  readonly fullWidth = input(false);

  readonly clicked = output<MouseEvent>();
}
