import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouritesPage } from './favourites-page';

describe('FavouritesPage', () => {
  let component: FavouritesPage;
  let fixture: ComponentFixture<FavouritesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouritesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FavouritesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
