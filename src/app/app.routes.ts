import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/onboarding/welcome/welcome.component').then(
        (m) => m.WelcomeComponent,
      ),
  },
];