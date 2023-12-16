import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioFeesDialogComponent } from './scenario-fees-dialog.component';

describe('ScenarioFeesDialogComponent', () => {
  let component: ScenarioFeesDialogComponent;
  let fixture: ComponentFixture<ScenarioFeesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScenarioFeesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioFeesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
