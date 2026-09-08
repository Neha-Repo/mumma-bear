import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mom-name',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mom-name.component.html',
  styleUrl: './mom-name.component.scss',
})
export class MomNameComponent {
  private readonly router = inject(Router);

  preferredName = '';

  continue(): void {
    const name = this.preferredName.trim();

    if (!name) {
      return;
    }

    this.preferredName = name;

    // Temporary local persistence until our onboarding repository
    // is introduced for the complete onboarding flow.
    localStorage.setItem('mumma-bear:mom-name', name);

    void this.router.navigate(['/onboarding/baby-details']);
  }
}