import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('renders registration fields and a link to login', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('app-auth-form h1')?.textContent).toContain('Crear cuenta');
    expect(element.querySelectorAll('app-auth-form input')).toHaveLength(3);
    expect(element.querySelector('app-auth-form [name="email"]')?.getAttribute('type')).toBe(
      'email',
    );
    expect(element.querySelector('app-auth-form [name="password"]')?.getAttribute('type')).toBe(
      'password',
    );
    expect(
      element.querySelector('app-auth-form [name="confirmPassword"]')?.getAttribute('type'),
    ).toBe('password');

    const loginLink = element.querySelector<HTMLAnchorElement>('.register-page__login a');
    expect(loginLink?.textContent?.trim()).toBe('Inicia sesión');
    expect(loginLink?.getAttribute('href')).toBe('/login');
  });

  it('shows an error when the passwords do not match', () => {
    const element: HTMLElement = fixture.nativeElement;
    const password = element.querySelector<HTMLInputElement>('[name="password"]')!;
    const confirmPassword = element.querySelector<HTMLInputElement>('[name="confirmPassword"]')!;
    const form = element.querySelector('form')!;

    password.value = 'secret';
    confirmPassword.value = 'different';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain(
      'Las contraseñas no coinciden.',
    );
  });

  it('does not show an error when the passwords match', () => {
    const element: HTMLElement = fixture.nativeElement;
    const password = element.querySelector<HTMLInputElement>('[name="password"]')!;
    const confirmPassword = element.querySelector<HTMLInputElement>('[name="confirmPassword"]')!;
    const form = element.querySelector('form')!;

    password.value = 'secret';
    confirmPassword.value = 'secret';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(component.passwordMismatch()).toBe(false);
  });
});
