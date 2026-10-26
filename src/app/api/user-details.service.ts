import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UpdateUserProfileRequest, UserProfile } from './user-details.model';

const API_URL = '/api/v1/user-details';

export interface AvatarUploadResponse {
  avatarUrl: string;
}

@Injectable({ providedIn: 'root' })
export class UserDetailsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  readonly avatarUrl = signal<string | null>(null);

  setAvatarUrl(avatarUrl: string | null): void {
    this.avatarUrl.set(avatarUrl);
  }

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(API_URL, { headers: this.authHeaders() });
  }

  updateCurrentUser(profile: UpdateUserProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(API_URL, profile, { headers: this.authHeaders() });
  }

  uploadAvatar(file: File): Observable<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<AvatarUploadResponse>(`${API_URL}/avatar`, formData, {
      headers: this.authHeaders(),
    });
  }

  deactivateCurrentUser(): Observable<void> {
    return this.http.delete<void>(API_URL, { headers: this.authHeaders() });
  }

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
