import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaperComponent } from './diaper.component';

describe('DiaperComponent', () => {
  let component: DiaperComponent;
  let fixture: ComponentFixture<DiaperComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
