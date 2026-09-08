import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthTypeComponent } from './birth-type.component';

describe('BirthTypeComponent', () => {
  let component: BirthTypeComponent;
  let fixture: ComponentFixture<BirthTypeComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BirthTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
