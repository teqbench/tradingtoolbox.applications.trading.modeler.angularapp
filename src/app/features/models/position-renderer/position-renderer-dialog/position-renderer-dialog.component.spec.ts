import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelRenderDialogComponent } from './position-renderer-dialog.component';

describe('ModelRenderDialogComponent', () => {
  let component: ModelRenderDialogComponent;
  let fixture: ComponentFixture<ModelRenderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelRenderDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelRenderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
