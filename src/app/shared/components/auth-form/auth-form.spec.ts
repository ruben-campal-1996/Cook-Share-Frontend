import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthForm } from './auth-form';

describe('AuthForm', () => {
  let fixture: ComponentFixture<AuthForm>;
  let component: AuthForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthForm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Iniciar sesión');
    fixture.componentRef.setInput('submitLabel', 'Entrar');
    fixture.componentRef.setInput('fields', [
      { name: 'email', label: 'Correo electrónico', type: 'email', required: true },
      { name: 'password', label: 'Contraseña', type: 'password', required: true },
    ]);
    fixture.detectChanges();
  });

  it('renders the configured title, fields, and submit label', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h1')?.textContent).toContain('Iniciar sesión');
    expect(element.querySelectorAll('input')).toHaveLength(2);
    expect(element.querySelector('button')?.textContent).toContain('Entrar');
  });

  it('emits the configured field values on submit', () => {
    const element = fixture.nativeElement as HTMLElement;
    const email = element.querySelector<HTMLInputElement>('[name="email"]');
    const password = element.querySelector<HTMLInputElement>('[name="password"]');
    const form = element.querySelector('form') as HTMLFormElement;
    const submitted = vi.fn();
    component.submitted.subscribe(submitted);

    email!.value = 'cook@example.com';
    password!.value = 'secret';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(submitted).toHaveBeenCalledWith({
      email: 'cook@example.com',
      password: 'secret',
    });
  });
});
