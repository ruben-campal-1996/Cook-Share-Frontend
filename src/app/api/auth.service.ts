import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

interface TokenResponse {
  token: string;
}

const API_URL = '/api/v1/auth';
const TOKEN_STORAGE_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  login(email: string, password: string): Observable<void> {
    return this.http.post<TokenResponse>(`${API_URL}/token`, { email, password }).pipe(
      tap(({ token }) => sessionStorage.setItem(TOKEN_STORAGE_KEY, token)),
      map(() => undefined),
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}
