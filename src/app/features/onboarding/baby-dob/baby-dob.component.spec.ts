import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyDobComponent } from './baby-dob.component';

describe('BabyDobComponent', () => {
  let component: BabyDobComponent;
  let fixture: ComponentFixture<BabyDobComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyDobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
