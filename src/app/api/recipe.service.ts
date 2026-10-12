import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from './recipe.model';

const API_URL = '/api/v1';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly http = inject(HttpClient);

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${API_URL}/recipes`);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${API_URL}/recipes/${id}`);
  }
}
