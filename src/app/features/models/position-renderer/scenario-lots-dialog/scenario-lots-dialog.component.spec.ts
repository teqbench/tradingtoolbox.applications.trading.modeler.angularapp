import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioLotsDialogComponent } from './scenario-lots-dialog.component';

describe('LotsDialogComponent', () => {
  let component: ScenarioLotsDialogComponent;
  let fixture: ComponentFixture<ScenarioLotsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioLotsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioLotsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
