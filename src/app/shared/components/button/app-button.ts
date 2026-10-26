import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'transparent' | 'green' | 'red' | 'yellow';
export type ButtonType = 'button' | 'submit' | 'reset' | 'file';

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
  readonly accept = input('.jpg,.jpeg,.png,image/jpeg,image/png');

  readonly clicked = output<MouseEvent>();
  readonly fileSelected = output<File>();

  onButtonClick(event: MouseEvent, fileInput: HTMLInputElement): void {
    this.clicked.emit(event);
    if (this.type() === 'file') {
      fileInput.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileSelected.emit(file);
    }
    input.value = '';
  }
}
