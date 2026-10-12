import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
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
});
