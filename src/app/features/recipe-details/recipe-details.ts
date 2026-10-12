import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, distinctUntilChanged, map, merge, of, Subject, switchMap, tap } from 'rxjs';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly retryRequests = new Subject<string | null>();
  private currentId: string | null = null;

  readonly recipe = signal<Recipe | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
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
      });
  }

  retryLoad(): void {
    this.retryRequests.next(this.currentId);
  }

  resolveImageUrl(imageUrl: string): string {
    return imageUrl.startsWith('./') ? imageUrl.slice(1) : imageUrl;
  }
}
