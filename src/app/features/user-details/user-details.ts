import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { UserDetailsService } from '../../api/user-details.service';
import { UserProfile } from '../../api/user-details.model';
import { AppButton } from '../../shared/components/button/app-button';

@Component({
  imports: [AppButton, FormsModule, RouterLink],
  selector: 'app-user-details',
  styleUrl: './user-details.css',
  templateUrl: './user-details.html',
})
export class UserDetails implements OnInit {
  private readonly userDetailsService = inject(UserDetailsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly profile = signal<UserProfile | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploadingAvatar = signal(false);
  readonly deleting = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly saveSuccess = signal(false);
  readonly deleteError = signal<string | null>(null);
  readonly nickname = signal('');
  readonly avatarUrl = signal('');
  readonly imagePreview = computed(() => this.resolveImageUrl(this.avatarUrl()));

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.loadError.set(null);

    if (!this.authService.isAuthenticated()) {
      this.loading.set(false);
      this.loadError.set('Inicia sesión para consultar los detalles de tu cuenta.');
      return;
    }

    this.userDetailsService
      .getCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.nickname.set(profile.nickname);
          this.avatarUrl.set(profile.avatarUrl ?? '');
          this.userDetailsService.setAvatarUrl(profile.avatarUrl);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load user details', error);
          if (error.status === 401) {
            this.authService.logout();
          }
          this.loadError.set(
            error.status === 401
              ? 'Inicia sesión para consultar los detalles de tu cuenta.'
              : 'No se han podido cargar los datos de la cuenta. Inténtalo de nuevo.',
          );
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
  }

  saveProfile(): void {
    if (this.uploadingAvatar()) {
      return;
    }

    const nickname = this.nickname().trim();
    if (!nickname) {
      this.saveError.set('El nombre de usuario es obligatorio.');
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);

    this.userDetailsService
      .updateCurrentUser({
        nickname,
        avatarUrl: this.avatarUrl().trim() || null,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.nickname.set(profile.nickname);
          this.avatarUrl.set(profile.avatarUrl ?? '');
          this.userDetailsService.setAvatarUrl(profile.avatarUrl);
          this.saveSuccess.set(true);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to update user details', error);
          if (error.status === 401) {
            this.authService.logout();
          }
          this.saveError.set(
            error.status === 409
              ? 'Ese nombre de usuario ya está en uso.'
              : error.status === 401
                ? 'Tu sesión ha caducado. Inicia sesión de nuevo.'
                : 'No se han podido guardar los cambios. Inténtalo de nuevo.',
          );
          this.saving.set(false);
        },
        complete: () => this.saving.set(false),
      });
  }

  onAvatarSelected(file: File): void {
    if (this.saving()) {
      return;
    }

    this.uploadingAvatar.set(true);
    this.saveError.set(null);
    this.saveSuccess.set(false);

    this.userDetailsService
      .uploadAvatar(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ avatarUrl }) => {
          this.avatarUrl.set(avatarUrl);
          this.userDetailsService.setAvatarUrl(avatarUrl);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to upload avatar', error);
          if (error.status === 401) {
            this.authService.logout();
          }
          this.saveError.set(
            error.status === 400 || error.status === 413
              ? 'La imagen debe ser JPG, JPEG o PNG y no superar 5 MB.'
              : error.status === 401
                ? 'Tu sesión ha caducado. Inicia sesión de nuevo.'
                : 'No se ha podido subir la imagen. Inténtalo de nuevo.',
          );
          this.uploadingAvatar.set(false);
        },
        complete: () => this.uploadingAvatar.set(false),
      });
  }

  deactivateAccount(): void {
    if (
      !window.confirm('¿Seguro que quieres desactivar tu cuenta? Esta acción cerrará tu sesión.')
    ) {
      return;
    }

    this.deleting.set(true);
    this.deleteError.set(null);
    this.userDetailsService
      .deactivateCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.authService.logout();
          void this.router.navigateByUrl('/');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to deactivate account', error);
          if (error.status === 401) {
            this.authService.logout();
          }
          this.deleteError.set(
            error.status === 401
              ? 'Tu sesión ha caducado. Inicia sesión de nuevo.'
              : 'No se ha podido desactivar la cuenta. Inténtalo de nuevo.',
          );
          this.deleting.set(false);
        },
      });
  }

  resolveImageUrl(imageUrl: string): string {
    return imageUrl.startsWith('./') ? imageUrl.slice(1) : imageUrl;
  }
}
