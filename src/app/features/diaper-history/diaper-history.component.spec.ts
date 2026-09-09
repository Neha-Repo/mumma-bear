import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaperHistoryComponent } from './diaper-history.component';

describe('DiaperHistoryComponent', () => {
  let component: DiaperHistoryComponent;
  let fixture: ComponentFixture<DiaperHistoryComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaperHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
