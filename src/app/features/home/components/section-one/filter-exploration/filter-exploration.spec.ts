import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterExploration } from './filter-exploration';

describe('FilterExploration', () => {
  let component: FilterExploration;
  let fixture: ComponentFixture<FilterExploration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterExploration],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterExploration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
