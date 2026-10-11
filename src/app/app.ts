import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderSection } from './core/layout/header/header-section/header-section';
import { FooterSection } from './core/layout/footer/footer-section/footer-section';

@Component({
  imports: [RouterOutlet, HeaderSection, FooterSection],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('cook-and-share');
}
