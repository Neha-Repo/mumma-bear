import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prematurity',
  standalone: true,
  templateUrl: './prematurity.component.html',
  styleUrl: './prematurity.component.scss',
})
export class PrematurityComponent {
  private readonly router = inject(Router);

  selected: boolean | null = null;

  select(value: boolean): void {
    this.selected = value;
  }

  continue(): void {
    if (this.selected === null) {
      return;
    }

    localStorage.setItem(
      'mumma-bear:baby-premature',
      String(this.selected),
    );

    if (this.selected) {
      void this.router.navigate(['/onboarding/gestational-age']);
      return;
    }

    void this.router.navigate(['/onboarding/feeding']);
  }
}