import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterSection } from './footer-section';

describe('FooterSection', () => {
  let component: FooterSection;
  let fixture: ComponentFixture<FooterSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterSection],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the brand message and navigation links', () => {
    const footer = fixture.nativeElement as HTMLElement;

    expect(footer.querySelector('h2')?.textContent).toContain('Cook&Share');
    expect(footer.textContent).toContain(
      'Comparte el amor por la cocina casera, descubre platos auténticos y planifica tus menús semanales.',
    );
    expect(
      Array.from(footer.querySelectorAll('nav a')).map((link) => link.getAttribute('href')),
    ).toEqual(['/', '/login', '/register']);
  });
});
