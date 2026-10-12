import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../api/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-header-section',
  styleUrl: './header-section.css',
  templateUrl: './header-section.html',
})
export class HeaderSection {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly userMenuOpen = signal(false);

  toggleUserMenu(): void {
    this.userMenuOpen.update((isOpen) => !isOpen);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeUserMenu();
    void this.router.navigateByUrl('/');
  }
}
