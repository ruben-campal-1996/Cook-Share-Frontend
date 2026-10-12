import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Recipe } from '../../../../../api/recipe.model';
import { Recipes } from './recipes';

describe('Recipes', () => {
  let component: Recipes;
  let fixture: ComponentFixture<Recipes>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recipes],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Recipes);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  const recipe: Recipe = {
    id: 1,
    name: 'Tortilla',
    description: 'Tortilla de patatas',
    instructions: 'Cocinar las patatas y los huevos.',
    imageUrl: 'https://example.com/tortilla.jpg',
    servings: 4,
    authorId: 10,
    statusId: 1,
    totalCalories: 800,
    caloriesPerServing: 200,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    status: 'PUBLISHED',
    publishedAt: '2026-01-01T00:00:00Z',
    reviewedAt: null,
    reviewedBy: null,
  };

  it('loads and renders recipes from the API', () => {
    fixture.detectChanges();

    const request = httpTesting.expectOne('http://localhost:8080/api/v1/recipes');
    expect(request.request.method).toBe('GET');
    request.flush([recipe]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Tortilla');
    expect(fixture.nativeElement.textContent).toContain('4 raciones');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe(
      '/recipe-details/1',
    );
  });

  it('shows an error and allows retrying when the API request fails', () => {
    fixture.detectChanges();
    httpTesting
      .expectOne('http://localhost:8080/api/v1/recipes')
      .flush('Service unavailable', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'No se han podido cargar las recetas. Inténtalo de nuevo.',
    );

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    httpTesting.expectOne('http://localhost:8080/api/v1/recipes').flush([recipe]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Tortilla');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
