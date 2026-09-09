import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreastfeedComponent } from './breastfeed.component';

describe('BreastfeedComponent', () => {
  let component: BreastfeedComponent;
  let fixture: ComponentFixture<BreastfeedComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BreastfeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
