import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './app-search.html',
})
export class AppSearch {
  readonly query = input('');
  readonly queryChange = output<string>();
  readonly placeholder = input('Buscar...');

  onQueryChange(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      this.queryChange.emit(input.value);
    }
  }
}
