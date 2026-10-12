import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, distinctUntilChanged, map, merge, of, Subject, switchMap, tap } from 'rxjs';
import { Category } from '../../api/category.model';
import { CategoryService } from '../../api/category.service';
import { Recipe } from '../../api/recipe.model';
import { RecipeService } from '../../api/recipe.service';

@Component({
  imports: [],
  selector: 'app-recipe-details',
  styleUrl: './recipe-details.css',
  templateUrl: './recipe-details.html',
})
export class RecipeDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly recipeService = inject(RecipeService);
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly retryRequests = new Subject<string | null>();
  private currentId: string | null = null;

  readonly recipe = signal<Recipe | null>(null);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly categoriesError = signal<string | null>(null);
  readonly recipeCategories = computed(() => {
    const recipe = this.recipe();
    if (!recipe) {
      return [];
    }

    const categoriesById = new Map(this.categories().map((category) => [category.id, category]));
    return recipe.categoryIds
      .map((categoryId) => categoriesById.get(categoryId))
      .filter((category): category is Category => category !== undefined);
  });
  readonly instructionSteps = computed(() => {
    const instructions = this.recipe()?.instructions ?? '';
    return instructions
      .split(/\r?\n/)
      .map((step) => step.replace(/^\s*\d+[.)]\s*/, '').trim())
      .filter(Boolean);
  });

  ngOnInit(): void {
    const routeIds = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      distinctUntilChanged(),
      tap((id) => (this.currentId = id)),
    );

    merge(routeIds, this.retryRequests)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
          this.recipe.set(null);
        }),
        switchMap((id) => {
          const recipeId = Number(id);
          if (!id || !Number.isInteger(recipeId) || recipeId <= 0) {
            this.error.set('El identificador de la receta no es válido.');
            return of(null);
          }

          return this.recipeService.getRecipeById(recipeId).pipe(
            catchError((error: HttpErrorResponse) => {
              console.error('Failed to load recipe', error);
              this.error.set('No se ha podido cargar la receta. Inténtalo de nuevo.');
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((recipe) => {
        this.recipe.set(recipe);
        this.loading.set(false);
        if (recipe) {
          this.loadCategories();
        }
      });
  }

  private loadCategories(): void {
    this.categoriesError.set(null);
    this.categories.set([]);
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => this.categories.set(categories),
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load recipe categories', error);
          this.categoriesError.set('No se han podido cargar las categorías de la receta.');
        },
      });
  }

  retryLoad(): void {
    this.retryRequests.next(this.currentId);
  }

  resolveImageUrl(imageUrl: string): string {
    return imageUrl.startsWith('./') ? imageUrl.slice(1) : imageUrl;
  }
}
