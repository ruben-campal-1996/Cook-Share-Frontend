import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from '../../api/recipe.model';
import { RecipeDetails } from './recipe-details';

describe('RecipeDetails', () => {
  let component: RecipeDetails;
  let fixture: ComponentFixture<RecipeDetails>;
  let httpTesting: HttpTestingController;

  const recipe: Recipe = {
    id: 7,
    name: 'Tortilla',
    description: 'Una tortilla casera.',
    instructions: '1. Cortar las patatas.\n2. Cocinar y servir.',
    imageUrl: './images/tortilla.png',
    servings: 4,
    categoryIds: [1],
    authorId: 1,
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeDetails],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new BehaviorSubject(convertToParamMap({ id: '7' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetails);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('loads and renders the selected recipe details', () => {
    fixture.detectChanges();
    const request = httpTesting.expectOne('/api/v1/recipes/7');
    expect(request.request.method).toBe('GET');
    request.flush(recipe);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Tortilla');
    expect(fixture.nativeElement.querySelector('img')?.getAttribute('src')).toBe(
      '/images/tortilla.png',
    );
    expect(fixture.nativeElement.textContent).toContain('Una tortilla casera.');
    expect(fixture.nativeElement.querySelectorAll('ol li').length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Cortar las patatas.');
  });

  it('shows a retry action when the recipe request fails', () => {
    fixture.detectChanges();
    httpTesting
      .expectOne('/api/v1/recipes/7')
      .flush('Not found', { status: 404, statusText: 'Not Found' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'No se ha podido cargar la receta. Inténtalo de nuevo.',
    );

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    httpTesting.expectOne('/api/v1/recipes/7').flush(recipe);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Tortilla');
  });

  it('converts a relative backend image path to a root-relative URL', () => {
    expect(component.resolveImageUrl('./images/tortilla.png')).toBe('/images/tortilla.png');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
