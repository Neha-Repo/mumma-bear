import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reminders',
  standalone: true,
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.scss',
})
export class RemindersComponent {
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
      'mumma-bear:reminders-enabled',
      String(this.selected),
    );

    void this.router.navigate(['/onboarding/complete']);
  }
}