import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteComponent } from './complete.component';

describe('CompleteComponent', () => {
  let component: CompleteComponent;
  let fixture: ComponentFixture<CompleteComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
