import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/onboarding/welcome/welcome.component').then(
        (m) => m.WelcomeComponent,
      ),
  },
  {
    path: 'onboarding/mom-name',
    loadComponent: () =>
      import('./features/onboarding/mom-name/mom-name.component').then(
        (m) => m.MomNameComponent,
      ),
  },
  {
    path: 'onboarding/baby-details',
    loadComponent: () =>
      import('./features/onboarding/baby-details/baby-details.component').then(
        (m) => m.BabyDetailsComponent,
      ),
  },
  {
    path: 'onboarding/baby-dob',
    loadComponent: () =>
      import('./features/onboarding/baby-dob/baby-dob.component').then(
        (m) => m.BabyDobComponent,
      ),
  },
  {
    path: 'onboarding/premature',
    loadComponent: () =>
      import('./features/onboarding/prematurity/prematurity.component').then(
        (m) => m.PrematurityComponent,
      ),
  },
  {
    path: 'onboarding/gestational-age',
    loadComponent: () =>
      import(
        './features/onboarding/gestational-age/gestational-age.component'
      ).then((m) => m.GestationalAgeComponent),
  },
  {
    path: 'onboarding/feeding',
    loadComponent: () =>
      import('./features/onboarding/feeding/feeding.component').then(
        (m) => m.FeedingComponent,
      ),
  },
  {
    path: 'onboarding/birth-type',
    loadComponent: () =>
      import('./features/onboarding/birth-type/birth-type.component').then(
        (m) => m.BirthTypeComponent,
      ),
  },
  {
    path: 'onboarding/reminders',
    loadComponent: () =>
      import('./features/onboarding/reminders/reminders.component').then(
        (m) => m.RemindersComponent,
      ),
  },
  {
    path: 'onboarding/complete',
    loadComponent: () =>
      import('./features/onboarding/complete/complete.component').then(
        (m) => m.CompleteComponent,
      ),
  },
];