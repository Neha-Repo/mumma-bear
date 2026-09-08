import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-baby-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './baby-details.component.html',
  styleUrl: './baby-details.component.scss',
})
export class BabyDetailsComponent {
  private readonly router = inject(Router);

  babyName = '';

  continue(): void {
    const name = this.babyName.trim();

    if (!name) {
      return;
    }

    localStorage.setItem('mumma-bear:baby-name', name);

    void this.router.navigate(['/onboarding/baby-dob']);
  }
}