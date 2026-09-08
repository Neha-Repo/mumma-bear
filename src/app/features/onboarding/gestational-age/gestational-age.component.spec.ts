import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestationalAgeComponent } from './gestational-age.component';

describe('GestationalAgeComponent', () => {
  let component: GestationalAgeComponent;
  let fixture: ComponentFixture<GestationalAgeComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestationalAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
