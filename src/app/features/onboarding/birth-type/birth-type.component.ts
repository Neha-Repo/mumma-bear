import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

type BirthType = 'vaginal' | 'caesarean' | 'assisted' | 'other';

@Component({
  selector: 'app-birth-type',
  standalone: true,
  templateUrl: './birth-type.component.html',
  styleUrl: './birth-type.component.scss',
})
export class BirthTypeComponent {
  private readonly router = inject(Router);

  selected: BirthType | null = null;

  select(type: BirthType): void {
    this.selected = type;
  }

  continue(): void {
    if (!this.selected) {
      return;
    }

    localStorage.setItem(
      'mumma-bear:birth-type',
      this.selected,
    );

    void this.router.navigate(['/onboarding/reminders']);
  }
}