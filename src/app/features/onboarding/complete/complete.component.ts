import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete',
  standalone: true,
  templateUrl: './complete.component.html',
  styleUrl: './complete.component.scss',
})
export class CompleteComponent {
  private readonly router = inject(Router);

  finish(): void {
    localStorage.setItem(
      'mumma-bear:onboarding-complete',
      'true',
    );

    void this.router.navigate(['/today']);
  }
}