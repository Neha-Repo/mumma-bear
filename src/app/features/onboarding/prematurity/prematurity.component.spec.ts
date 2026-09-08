import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrematurityComponent } from './prematurity.component';

describe('PrematurityComponent', () => {
  let component: PrematurityComponent;
  let fixture: ComponentFixture<PrematurityComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrematurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
