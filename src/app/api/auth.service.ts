import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

interface TokenResponse {
  token: string;
}

const API_URL = '/api/v1/auth';
const TOKEN_STORAGE_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly token = signal<string | null>(sessionStorage.getItem(TOKEN_STORAGE_KEY));

  readonly isAuthenticated = computed(() => this.token() !== null);

  login(email: string, password: string): Observable<void> {
    return this.http.post<TokenResponse>(`${API_URL}/token`, { email, password }).pipe(
      tap(({ token }) => {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
        this.token.set(token);
      }),
      map(() => undefined),
    );
  }

  changePassword(email: string, currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/change-password`, {
      email,
      currentPassword,
      newPassword,
    });
  }

  getToken(): string | null {
    return this.token();
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    this.token.set(null);
  }
}
