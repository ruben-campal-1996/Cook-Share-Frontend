import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppButton } from './app-button';

describe('AppButton', () => {
  let fixture: ComponentFixture<AppButton>;
  let component: AppButton;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppButton],
    }).compileComponents();

    fixture = TestBed.createComponent(AppButton);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Guardar receta');
    fixture.detectChanges();
  });

  it('renders the configured label and defaults to a primary button', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.textContent).toContain('Guardar receta');
    expect(button.type).toBe('button');
    expect(button.classList).toContain('bg-(--button-background,var(--color-primary-500))');
  });

  it('applies parent-configured type, variant, and full width', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.componentRef.setInput('variant', 'transparent');
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.type).toBe('submit');
    expect(button.classList).toContain('border-(--button-border-color,var(--color-primary-500))');
    expect(button.classList).toContain('w-full');
  });

  it('uses the secondary color for the secondary variant', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.classList).toContain('bg-(--button-background,var(--color-secondary-600))');
    expect(button.classList).toContain(
      'enabled:hover:bg-(--button-hover-background,var(--color-secondary-700))',
    );
  });

  it('disables the native button when requested', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });

  it('emits the click event to the parent', () => {
    const clicked = vi.fn();
    component.clicked.subscribe(clicked);

    fixture.nativeElement.querySelector('button').click();

    expect(clicked).toHaveBeenCalledOnce();
  });

  it('opens an image file picker and emits the selected file', () => {
    fixture.componentRef.setInput('type', 'file');
    fixture.detectChanges();

    const fileInput = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    const pickerClick = vi.spyOn(fileInput, 'click');
    const file = new File(['image'], 'avatar.jpg', { type: 'image/jpeg' });
    const fileSelected = vi.fn();
    component.fileSelected.subscribe(fileSelected);

    fixture.nativeElement.querySelector('button').click();
    Object.defineProperty(fileInput, 'files', { configurable: true, value: [file] });
    fileInput.dispatchEvent(new Event('change'));

    expect(pickerClick).toHaveBeenCalledOnce();
    expect(fileInput.accept).toBe('.jpg,.jpeg,.png,image/jpeg,image/png');
    expect(fileSelected).toHaveBeenCalledWith(file);
    expect(fileInput.value).toBe('');
  });
});
