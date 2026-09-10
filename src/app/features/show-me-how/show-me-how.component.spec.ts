import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMeHowComponent } from './show-me-how.component';

describe('ShowMeHowComponent', () => {
  let component: ShowMeHowComponent;
  let fixture: ComponentFixture<ShowMeHowComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMeHowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
