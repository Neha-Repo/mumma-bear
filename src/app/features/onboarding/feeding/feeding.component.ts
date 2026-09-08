import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

type FeedingMethod =
  | 'breastfeeding'
  | 'formula'
  | 'combination'
  | 'expressed-milk';

@Component({
  selector: 'app-feeding',
  standalone: true,
  templateUrl: './feeding.component.html',
  styleUrl: './feeding.component.scss',
})
export class FeedingComponent {
  private readonly router = inject(Router);

  selected: FeedingMethod | null = null;

  select(method: FeedingMethod): void {
    this.selected = method;
  }

  continue(): void {
    if (!this.selected) {
      return;
    }

    localStorage.setItem(
      'mumma-bear:feeding-method',
      this.selected,
    );

    void this.router.navigate(['/onboarding/birth-type']);
  }
}