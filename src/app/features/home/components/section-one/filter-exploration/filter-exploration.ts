import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Category } from '../../../../../api/category.model';
import { CategoryService } from '../../../../../api/category.service';
import { AppButton } from '../../../../../shared/components/button/app-button';
import { AppSearch } from '../../../../../shared/components/search/app-search';
import { AppTag } from '../../../../../shared/components/tags/app-tag';

@Component({
  imports: [AppButton, AppSearch, AppTag],
  selector: 'app-filter-exploration',
  styleUrl: './filter-exploration.css',
  templateUrl: './filter-exploration.html',
})
export class FilterExploration implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('filterSection') private filterSection!: ElementRef<HTMLElement>;

  readonly categories = signal<Category[]>([]);
  readonly selectedCategoryIds = signal<number[]>([]);
  readonly selectedCategoryIdsChange = output<number[]>();
  readonly searchQuery = signal('');
  readonly maxVisibleCategories = 7;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly filteredCategories = computed(() => {
    const query = this.normalize(this.searchQuery().trim());
    const selectedCategoryIds = new Set(this.selectedCategoryIds());

    return this.categories()
      .filter((category) => this.normalize(category.name).includes(query))
      .sort(
        (first, second) =>
          Number(selectedCategoryIds.has(second.id)) - Number(selectedCategoryIds.has(first.id)),
      );
  });
  readonly showAllCategories = signal(false);
  readonly visibleCategories = computed(() =>
    this.showAllCategories()
      ? this.filteredCategories()
      : this.filteredCategories().slice(0, this.maxVisibleCategories),
  );

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
    const selectedIds = this.selectedCategoryIds();
    const updatedIds = selected
      ? selectedIds.includes(categoryId)
        ? selectedIds
        : [...selectedIds, categoryId]
      : selectedIds.filter((selectedId) => selectedId !== categoryId);

    this.selectedCategoryIds.set(updatedIds);
    this.selectedCategoryIdsChange.emit(updatedIds);
    this.showAllCategories.set(false);
    this.filterSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleCategories(): void {
    this.showAllCategories.update((showAll) => !showAll);
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
  }
}
