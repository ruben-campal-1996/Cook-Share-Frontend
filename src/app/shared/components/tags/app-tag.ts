import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './app-tag.html',
})
export class AppTag {
  readonly label = input.required<string>();
  readonly selected = input(false);
  readonly selectedChange = output<boolean>();

  toggle(): void {
    this.selectedChange.emit(!this.selected());
  }
}
