import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTag } from './app-tag';

describe('AppTag', () => {
  let fixture: ComponentFixture<AppTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTag],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTag);
    fixture.componentRef.setInput('label', 'Vegetariano');
    fixture.detectChanges();
  });

  it('renders its label as an unselected button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.textContent?.trim()).toBe('#Vegetariano');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('emits the toggled selection state when clicked', () => {
    const selectedChange = vi.fn();
    fixture.componentInstance.selectedChange.subscribe(selectedChange);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();
    expect(selectedChange).toHaveBeenCalledWith(true);

    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');

    button.click();
    expect(selectedChange).toHaveBeenCalledWith(false);
  });
});
