import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../api/auth.service';
import { UserDetailsService } from '../../../../api/user-details.service';

@Component({
  imports: [RouterLink],
  selector: 'app-header-section',
  styleUrl: './header-section.css',
  templateUrl: './header-section.html',
})
export class HeaderSection {
  readonly authService = inject(AuthService);
  readonly nickname = signal('');
  private readonly userDetailsService = inject(UserDetailsService);
  readonly avatarUrl = computed(() => {
    const avatarUrl = this.userDetailsService.avatarUrl();
    if (!avatarUrl) {
      return '/images/avatar_defaultUrl.png';
    }
    return avatarUrl.startsWith('./') ? avatarUrl.slice(1) : avatarUrl;
  });
  private readonly router = inject(Router);

  readonly userMenuOpen = signal(false);

  constructor() {
    effect((onCleanup) => {
      if (!this.authService.isAuthenticated()) {
        this.nickname.set('');
        this.userDetailsService.setAvatarUrl(null);
        return;
      }

      const subscription = this.userDetailsService.getCurrentUser().subscribe({
        next: (profile) => {
          this.nickname.set(profile.nickname);
          this.userDetailsService.setAvatarUrl(profile.avatarUrl);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load header user details', error);
          if (error.status === 401) {
            this.authService.logout();
          }
        },
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

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
