import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Category } from '../../../../../api/category.model';
import { CategoryService } from '../../../../../api/category.service';
import { AppSearch } from '../../../../../shared/components/search/app-search';
import { AppTag } from '../../../../../shared/components/tags/app-tag';

@Component({
  imports: [AppSearch, AppTag],
  selector: 'app-filter-exploration',
  styleUrl: './filter-exploration.css',
  templateUrl: './filter-exploration.html',
})
export class FilterExploration implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories = signal<Category[]>([]);
  readonly selectedCategoryIds = signal<number[]>([]);
  readonly searchQuery = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filteredCategories = computed(() => {
    const query = this.normalize(this.searchQuery().trim());
    return this.categories().filter((category) => this.normalize(category.name).includes(query));
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.error.set(null);

    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => this.categories.set(categories),
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load categories', error);
          this.error.set('No se han podido cargar las categorías. Inténtalo de nuevo.');
          this.loading.set(false);
        },
        complete: () => this.loading.set(false),
      });
  }

  setCategorySelected(categoryId: number, selected: boolean): void {
    this.selectedCategoryIds.update((selectedIds) =>
      selected
        ? [...selectedIds, categoryId]
        : selectedIds.filter((selectedId) => selectedId !== categoryId),
    );
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
  }
}
