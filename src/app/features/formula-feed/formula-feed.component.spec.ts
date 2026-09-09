import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaFeedComponent } from './formula-feed.component';

describe('FormulaFeedComponent', () => {
  let component: FormulaFeedComponent;
  let fixture: ComponentFixture<FormulaFeedComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
