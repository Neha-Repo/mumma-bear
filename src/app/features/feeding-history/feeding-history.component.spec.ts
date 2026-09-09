import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingHistoryComponent } from './feeding-history.component';

describe('FeedingHistoryComponent', () => {
  let component: FeedingHistoryComponent;
  let fixture: ComponentFixture<FeedingHistoryComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
