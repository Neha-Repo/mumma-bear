import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomNameComponent } from './mom-name.component';

describe('MomNameComponent', () => {
  let component: MomNameComponent;
  let fixture: ComponentFixture<MomNameComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MomNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
