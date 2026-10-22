import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    sessionStorage.removeItem('auth_token');
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
    sessionStorage.removeItem('auth_token');
  });

  it('renders registration fields and a link to login', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('app-auth-form h1')?.textContent).toContain('Crear cuenta');
    expect(element.querySelectorAll('app-auth-form input')).toHaveLength(4);
    expect(
      element.querySelector('app-auth-form [name="nickname"]')?.getAttribute('maxlength'),
    ).toBe('60');
    expect(element.querySelector('app-auth-form [name="email"]')?.getAttribute('type')).toBe(
      'email',
    );
    expect(element.querySelector('app-auth-form [name="password"]')?.getAttribute('type')).toBe(
      'password',
    );
    expect(
      element.querySelector('app-auth-form [name="confirmPassword"]')?.getAttribute('type'),
    ).toBe('password');
    expect(
      element.querySelector('app-auth-form [name="password"]')?.getAttribute('minlength'),
    ).toBe('8');

    const loginLink = element.querySelector<HTMLAnchorElement>('.register-page__login a');
    expect(loginLink?.textContent?.trim()).toBe('Inicia sesión');
    expect(loginLink?.getAttribute('href')).toBe('/login');
  });

  it('shows an error when the passwords do not match', () => {
    const element: HTMLElement = fixture.nativeElement;
    const password = element.querySelector<HTMLInputElement>('[name="password"]')!;
    const confirmPassword = element.querySelector<HTMLInputElement>('[name="confirmPassword"]')!;
    const form = element.querySelector('form')!;
    element.querySelector<HTMLInputElement>('[name="nickname"]')!.value = 'Cocinero';
    element.querySelector<HTMLInputElement>('[name="email"]')!.value = 'cook@example.com';

    password.value = 'secret123';
    confirmPassword.value = 'different';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Las contraseñas no coinciden.',
    );
  });

  it('creates the account when the passwords match', () => {
    const element: HTMLElement = fixture.nativeElement;
    const password = element.querySelector<HTMLInputElement>('[name="password"]')!;
    const confirmPassword = element.querySelector<HTMLInputElement>('[name="confirmPassword"]')!;
    const form = element.querySelector('form')!;
    element.querySelector<HTMLInputElement>('[name="nickname"]')!.value = 'Cocinero';
    element.querySelector<HTMLInputElement>('[name="email"]')!.value = 'cook@example.com';

    password.value = 'secret123';
    confirmPassword.value = 'secret123';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    const request = httpTesting.expectOne('/api/v1/auth/register');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      nickname: 'Cocinero',
      email: 'cook@example.com',
      password: 'secret123',
    });
    request.flush(null);
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(component.registered()).toBe(true);
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Cuenta creada');
  });

  it('does not send the registration request when passwords do not match', () => {
    component.onSubmit({
      nickname: 'Cocinero',
      email: 'cook@example.com',
      password: 'secret123',
      confirmPassword: 'different',
    });

    httpTesting.expectNone('/api/v1/auth/register');
    expect(component.passwordMismatch()).toBe(true);
  });

  it('shows an error when the email or nickname is already in use', () => {
    component.onSubmit({
      nickname: 'Cocinero',
      email: 'cook@example.com',
      password: 'secret123',
      confirmPassword: 'secret123',
    });
    httpTesting
      .expectOne('/api/v1/auth/register')
      .flush({}, { status: 409, statusText: 'Conflict' });

    expect(component.error()).toBe('El correo electrónico o el nombre de usuario ya está en uso.');
  });
});
