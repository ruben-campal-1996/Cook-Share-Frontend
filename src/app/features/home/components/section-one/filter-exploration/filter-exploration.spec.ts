import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FilterExploration } from './filter-exploration';

describe('FilterExploration', () => {
  let component: FilterExploration;
  let fixture: ComponentFixture<FilterExploration>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterExploration],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterExploration);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads categories from the API and renders selectable tags', () => {
    fixture.detectChanges();
    const request = httpTesting.expectOne('/api/v1/categories');
    expect(request.request.method).toBe('GET');
    request.flush([
      { id: 1, name: 'Vegetariano' },
      { id: 2, name: 'Postres' },
    ]);
    fixture.detectChanges();

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('app-tag button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent?.trim()).toBe('#Vegetariano');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');

    buttons[0].click();
    fixture.detectChanges();
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('filters category tags by search text, ignoring case and accents', () => {
    fixture.detectChanges();
    httpTesting.expectOne('/api/v1/categories').flush([
      { id: 1, name: 'Desayunos' },
      { id: 2, name: 'Postres' },
      { id: 3, name: 'Bebidas' },
    ]);
    fixture.detectChanges();

    const searchInput: HTMLInputElement = fixture.nativeElement.querySelector('app-search input');
    searchInput.value = 'POSTRES';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('app-tag button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent?.trim()).toBe('#Postres');

    searchInput.value = 'bebída';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('app-tag button')?.textContent?.trim(),
    ).toBe('#Bebidas');

    searchInput.value = 'no existe';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'No hay categorías que coincidan con la búsqueda.',
    );
  });

  it('shows a retry action if categories cannot be loaded', () => {
    fixture.detectChanges();
    httpTesting
      .expectOne('/api/v1/categories')
      .flush({}, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'No se han podido cargar las categorías. Inténtalo de nuevo.',
    );

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    httpTesting.expectOne('/api/v1/categories').flush([{ id: 1, name: 'Vegetariano' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Vegetariano');
  });
});
