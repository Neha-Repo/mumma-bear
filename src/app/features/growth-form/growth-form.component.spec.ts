import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthFormComponent } from './growth-form.component';

describe('GrowthFormComponent', () => {
  let component: GrowthFormComponent;
  let fixture: ComponentFixture<GrowthFormComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
