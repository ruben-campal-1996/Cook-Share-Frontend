import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { UserProfile } from '../../api/user-details.model';
import { UserDetails } from './user-details';
import { vi } from 'vitest';

describe('UserDetails', () => {
  let component: UserDetails;
  let fixture: ComponentFixture<UserDetails>;
  let httpTesting: HttpTestingController;

  const profile: UserProfile = {
    userId: 7,
    nickname: 'cocinero',
    avatarUrl: './images/avatar.png',
    roleId: 2,
    roleName: 'USER',
    updatedAt: '2026-10-12T10:00:00',
  };

  beforeEach(async () => {
    sessionStorage.setItem('auth_token', 'test-jwt');
    await TestBed.configureTestingModule({
      imports: [UserDetails],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetails);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const request = httpTesting.expectOne('/api/v1/user-details');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-jwt');
    request.flush(profile);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
    sessionStorage.removeItem('auth_token');
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the profile and saves updated nickname and avatar', () => {
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Detalles de cuenta');
    expect(fixture.nativeElement.querySelector('.user-details__role')?.textContent).toBe(
      'cocinero',
    );
    expect(fixture.nativeElement.querySelector('.user-details__id')?.textContent).toBe('USER');
    expect(fixture.nativeElement.querySelector('.user-details__avatar')?.getAttribute('src')).toBe(
      '/images/avatar.png',
    );

    component.nickname.set('nuevo-nombre');
    component.avatarUrl.set('/images/new-avatar.png');
    component.saveProfile();

    const request = httpTesting.expectOne('/api/v1/user-details');
    expect(request.request.method).toBe('PUT');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-jwt');
    expect(request.request.body).toEqual({
      nickname: 'nuevo-nombre',
      avatarUrl: '/images/new-avatar.png',
    });
    request.flush({ ...profile, nickname: 'nuevo-nombre', avatarUrl: '/images/new-avatar.png' });
    fixture.detectChanges();

    expect(component.saveSuccess()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Los cambios se han guardado.');
  });

  it('uploads a selected avatar and saves the returned URL with the profile', async () => {
    const file = new File(['image'], 'avatar.png', { type: 'image/png' });
    component.onAvatarSelected(file);

    const uploadRequest = httpTesting.expectOne('/api/v1/user-details/avatar');
    expect(uploadRequest.request.method).toBe('POST');
    expect(uploadRequest.request.body).toBeInstanceOf(FormData);
    expect((uploadRequest.request.body as FormData).get('file')).toBe(file);
    uploadRequest.flush({ avatarUrl: '/images/uploaded-avatar.png' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.avatarUrl()).toBe('/images/uploaded-avatar.png');
    expect(fixture.nativeElement.querySelector('#avatarUrl').value).toBe(
      '/images/uploaded-avatar.png',
    );
    expect(fixture.nativeElement.querySelector('.user-details__avatar').getAttribute('src')).toBe(
      '/images/uploaded-avatar.png',
    );

    component.saveProfile();
    const updateRequest = httpTesting.expectOne('/api/v1/user-details');
    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body.avatarUrl).toBe('/images/uploaded-avatar.png');
    updateRequest.flush({ ...profile, avatarUrl: '/images/uploaded-avatar.png' });
  });

  it('requests account deactivation after confirmation and clears the session', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const authService = TestBed.inject(AuthService);

    component.deactivateAccount();
    const request = httpTesting.expectOne('/api/v1/user-details');
    expect(confirmSpy).toHaveBeenCalled();
    expect(request.request.method).toBe('DELETE');
    expect(request.request.headers.get('Authorization')).toBe('Bearer test-jwt');
    request.flush(null);

    expect(authService.isAuthenticated()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('does not request deactivation when confirmation is cancelled', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deactivateAccount();

    expect(component.deleting()).toBe(false);
    httpTesting.expectNone({ method: 'DELETE', url: '/api/v1/user-details' });
  });
});
