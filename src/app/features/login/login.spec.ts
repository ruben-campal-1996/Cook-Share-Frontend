import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
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

  it('renders the login form and a link to registration', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('app-auth-form h1')?.textContent).toContain('Iniciar sesión');
    expect(element.querySelectorAll('app-auth-form input')).toHaveLength(2);
    expect(element.querySelector('app-auth-form [name="email"]')?.getAttribute('type')).toBe(
      'email',
    );
    expect(element.querySelector('app-auth-form [name="password"]')?.getAttribute('type')).toBe(
      'password',
    );

    const registerLink = element.querySelector<HTMLAnchorElement>('.login-page__register a');
    expect(registerLink?.textContent?.trim()).toBe('Regístrate');
    expect(registerLink?.getAttribute('href')).toBe('/register');
  });

  it('sends the login credentials and stores the returned JWT', () => {
    component.onSubmit({ email: 'user@example.com', password: 'secret' });

    const request = httpTesting.expectOne('/api/v1/auth/token');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'user@example.com',
      password: 'secret',
    });
    request.flush({ token: 'signed-jwt' });

    expect(sessionStorage.getItem('auth_token')).toBe('signed-jwt');
  });

  it('shows a helpful message when the credentials are rejected', () => {
    component.onSubmit({ email: 'user@example.com', password: 'wrong' });
    httpTesting
      .expectOne('/api/v1/auth/token')
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(component.error()).toBe('Correo electrónico o contraseña incorrectos.');
  });

  it('shows when the backend requires a password change', () => {
    component.onSubmit({ email: 'user@example.com', password: 'temporary' });
    httpTesting.expectOne('/api/v1/auth/token').flush({}, { status: 409, statusText: 'Conflict' });

    expect(component.error()).toBe('Debes cambiar tu contraseña antes de iniciar sesión.');
  });
});
