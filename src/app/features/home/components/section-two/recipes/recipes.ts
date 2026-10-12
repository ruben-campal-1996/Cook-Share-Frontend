import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../../../../api/recipe.model';
import { RecipeService } from '../../../../../api/recipe.service';

@Component({
  imports: [RouterLink],
  selector: 'app-recipes',
  styleUrl: './recipes.css',
  templateUrl: './recipes.html',
})
export class Recipes implements OnInit {
  private readonly recipeService = inject(RecipeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly recipes = signal<Recipe[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.recipeService
      .getRecipes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (recipes) => this.recipes.set(recipes),
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load recipes', error);
          this.error.set('No se han podido cargar las recetas. Inténtalo de nuevo.');
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
  }
}
