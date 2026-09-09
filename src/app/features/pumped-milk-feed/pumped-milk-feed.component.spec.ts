import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PumpedMilkFeedComponent } from './pumped-milk-feed.component';

describe('PumpedMilkFeedComponent', () => {
  let component: PumpedMilkFeedComponent;
  let fixture: ComponentFixture<PumpedMilkFeedComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PumpedMilkFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
