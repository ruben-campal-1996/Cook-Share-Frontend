import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSearch } from './app-search';

describe('AppSearch', () => {
  let fixture: ComponentFixture<AppSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSearch);
    fixture.detectChanges();
  });

  it('renders a search input with its placeholder', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(input.type).toBe('search');
    expect(input.placeholder).toBe('Buscar...');
  });

  it('emits the entered search query', () => {
    const queryChange = vi.fn();
    fixture.componentInstance.queryChange.subscribe(queryChange);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    input.value = 'postres';
    input.dispatchEvent(new Event('input'));

    expect(queryChange).toHaveBeenCalledWith('postres');
  });
});
