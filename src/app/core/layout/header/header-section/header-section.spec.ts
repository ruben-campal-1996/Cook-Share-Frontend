import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderSection } from './header-section';

describe('HeaderSection', () => {
  let component: HeaderSection;
  let fixture: ComponentFixture<HeaderSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSection],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
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
});
