import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpedMilkComponent } from './pumped-milk.component';

describe('PumpedMilkComponent', () => {
  let component: PumpedMilkComponent;
  let fixture: ComponentFixture<PumpedMilkComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpedMilkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
