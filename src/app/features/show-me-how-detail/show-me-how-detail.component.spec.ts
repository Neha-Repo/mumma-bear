import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMeHowDetailComponent } from './show-me-how-detail.component';

describe('ShowMeHowDetailComponent', () => {
  let component: ShowMeHowDetailComponent;
  let fixture: ComponentFixture<ShowMeHowDetailComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMeHowDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
