import {
  Component,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  templateUrl:
    './feed.component.html',
  styleUrl:
    './feed.component.scss',
})
export class FeedComponent {
  private router =
    inject(Router);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  goBack(): void {
    void this.router.navigate(
      ['/today'],
    );
  }

  startBreastfeed(): void {
    void this.router.navigate(
      ['/feed/breastfeed'],
    );
  }

  startPumpedMilkFeed(): void {
    void this.router.navigate(
      ['/feed/pumped-milk'],
    );
  }

  startFormulaFeed(): void {
    void this.router.navigate(
      ['/feed/formula'],
    );
  }

  viewHistory(): void {
    void this.router.navigate(
      ['/feed/history'],
    );
  }
}