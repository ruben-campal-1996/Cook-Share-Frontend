import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../../app.routes';
import { HeaderSection } from './header-section';

describe('HeaderSection', () => {
  let component: HeaderSection;
  let fixture: ComponentFixture<HeaderSection>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    sessionStorage.removeItem('auth_token');
    await TestBed.configureTestingModule({
      imports: [HeaderSection],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderSection);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
    sessionStorage.removeItem('auth_token');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the logo and a link to login', () => {
    const element: HTMLElement = fixture.nativeElement;
    const logo = element.querySelector<HTMLImageElement>('.header__logo');
    const homeLink = element.querySelector<HTMLAnchorElement>('.header__home');
    const loginLink = element.querySelector<HTMLAnchorElement>('.header__login');

    expect(logo?.getAttribute('src')).toBe('/favicon_io/android-chrome-192x192.png');
    expect(logo?.alt).toBe('Cook and Share');
    expect(homeLink?.getAttribute('href')).toBe('/');
    expect(loginLink?.textContent?.trim()).toBe('Iniciar sesión');
    expect(loginLink?.getAttribute('href')).toBe('/login');
  });

  it('shows the account menu for an authenticated user and logs out', () => {
    component.authService.login('user@example.com', 'secret').subscribe();
    httpTesting.expectOne('/api/v1/auth/token').flush({ token: 'signed-jwt' });
    fixture.detectChanges();

    httpTesting.expectOne('/api/v1/user-details').flush({
      userId: 1,
      nickname: 'cocinero',
      avatarUrl: null,
      roleId: 1,
      roleName: 'USER',
      updatedAt: '2026-01-01T00:00:00Z',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.header__login')).toBeNull();
    expect(fixture.nativeElement.querySelector('.header__nickname')?.textContent?.trim()).toBe(
      'cocinero',
    );
    const userButton: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('.header__user-toggle');
    expect(userButton?.querySelector('img')?.getAttribute('src')).toBe(
      '/images/avatar_defaultUrl.png',
    );

    userButton?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Detalles de cuenta');
    expect(fixture.nativeElement.textContent).toContain('Desconectarse');
    expect(
      fixture.nativeElement.querySelector('.header__menu-item[routerLink]')?.getAttribute('href'),
    ).toBe('/user-details');

    fixture.nativeElement.querySelectorAll('.header__menu-item')[1].click();
    fixture.detectChanges();
    expect(component.authService.isAuthenticated()).toBe(false);
    expect(fixture.nativeElement.querySelector('.header__login')?.textContent).toContain(
      'Iniciar sesión',
    );
    expect(fixture.nativeElement.querySelector('.header__menu')).toBeNull();
  });

  it('navigates to the account details route when selected', async () => {
    component.authService.login('user@example.com', 'secret').subscribe();
    httpTesting.expectOne('/api/v1/auth/token').flush({ token: 'signed-jwt' });
    fixture.detectChanges();
    httpTesting.expectOne('/api/v1/user-details').flush({
      userId: 1,
      nickname: 'cocinero',
      avatarUrl: null,
      roleId: 1,
      roleName: 'USER',
      updatedAt: '2026-01-01T00:00:00Z',
    });
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.header__user-toggle').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.header__menu-item[routerLink]').click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/user-details');
  });
});
