import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/v1/categories');
  }
}
