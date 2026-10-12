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
    categoryIds: [1],
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

    const request = httpTesting.expectOne('/api/v1/recipes');
    expect(request.request.method).toBe('GET');
    request.flush([recipe]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Tortilla');
    expect(fixture.nativeElement.textContent).toContain('4 raciones');
    expect(fixture.nativeElement.querySelector('a')?.getAttribute('href')).toBe(
      '/recipe-details/1',
    );
  });

  it('converts relative backend image paths to root-relative URLs', () => {
    expect(component.resolveImageUrl('./images/avatar_defaultUrl.png')).toBe(
      '/images/avatar_defaultUrl.png',
    );
    expect(component.resolveImageUrl('https://cdn.example.com/recipe.png')).toBe(
      'https://cdn.example.com/recipe.png',
    );
  });

  it('filters recipes to those matching every selected category', () => {
    fixture.detectChanges();
    httpTesting.expectOne('/api/v1/recipes').flush([
      recipe,
      {
        ...recipe,
        id: 2,
        name: 'Ensalada',
        categoryIds: [1, 2],
      },
      {
        ...recipe,
        id: 3,
        name: 'Postre',
        categoryIds: [2],
      },
    ]);
    fixture.componentRef.setInput('selectedCategoryIds', [1, 2]);
    fixture.detectChanges();

    expect(component.filteredRecipes().map(({ name }) => name)).toEqual(['Ensalada']);
    const recipeTitles: string[] = Array.from(
      fixture.nativeElement.querySelectorAll('h2'),
      (heading: Element) => heading.textContent?.trim() ?? '',
    );
    expect(recipeTitles).toEqual(['Ensalada']);
  });

  it('shows all recipes when no category is selected', () => {
    fixture.detectChanges();
    httpTesting
      .expectOne('/api/v1/recipes')
      .flush([recipe, { ...recipe, id: 2, name: 'Ensalada', categoryIds: [2] }]);
    fixture.detectChanges();

    expect(component.filteredRecipes()).toHaveLength(2);
  });

  it('shows an empty result message when no recipe matches the selection', () => {
    fixture.detectChanges();
    httpTesting.expectOne('/api/v1/recipes').flush([recipe]);
    fixture.componentRef.setInput('selectedCategoryIds', [2]);
    fixture.detectChanges();

    expect(component.filteredRecipes()).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain(
      'No hay recetas que coincidan con todas las categorías seleccionadas.',
    );
  });

  it('shows an error and allows retrying when the API request fails', () => {
    fixture.detectChanges();
    httpTesting
      .expectOne('/api/v1/recipes')
      .flush('Service unavailable', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'No se han podido cargar las recetas. Inténtalo de nuevo.',
    );

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    httpTesting.expectOne('/api/v1/recipes').flush([recipe]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Tortilla');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
