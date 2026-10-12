import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UpdateUserProfileRequest, UserProfile } from './user-details.model';

const API_URL = '/api/v1/user-details';

@Injectable({ providedIn: 'root' })
export class UserDetailsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getCurrentUser(): Observable<UserProfile> {
    return this.http.get<UserProfile>(API_URL, { headers: this.authHeaders() });
  }

  updateCurrentUser(profile: UpdateUserProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(API_URL, profile, { headers: this.authHeaders() });
  }

  deactivateCurrentUser(): Observable<void> {
    return this.http.delete<void>(API_URL, { headers: this.authHeaders() });
  }

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }
}
