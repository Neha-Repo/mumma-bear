import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import(
        './features/onboarding/welcome/welcome.component'
      ).then(
        (m) =>
          m.WelcomeComponent,
      ),
  },

  {
    path: 'onboarding/mom-name',
    loadComponent: () =>
      import(
        './features/onboarding/mom-name/mom-name.component'
      ).then(
        (m) =>
          m.MomNameComponent,
      ),
  },

  {
    path: 'onboarding/baby-details',
    loadComponent: () =>
      import(
        './features/onboarding/baby-details/baby-details.component'
      ).then(
        (m) =>
          m.BabyDetailsComponent,
      ),
  },

  {
    path: 'onboarding/baby-dob',
    loadComponent: () =>
      import(
        './features/onboarding/baby-dob/baby-dob.component'
      ).then(
        (m) =>
          m.BabyDobComponent,
      ),
  },

  {
    path: 'onboarding/premature',
    loadComponent: () =>
      import(
        './features/onboarding/prematurity/prematurity.component'
      ).then(
        (m) =>
          m.PrematurityComponent,
      ),
  },

  {
    path: 'onboarding/gestational-age',
    loadComponent: () =>
      import(
        './features/onboarding/gestational-age/gestational-age.component'
      ).then(
        (m) =>
          m.GestationalAgeComponent,
      ),
  },

  {
    path: 'onboarding/feeding',
    loadComponent: () =>
      import(
        './features/onboarding/feeding/feeding.component'
      ).then(
        (m) =>
          m.FeedingComponent,
      ),
  },

  {
    path: 'onboarding/birth-type',
    loadComponent: () =>
      import(
        './features/onboarding/birth-type/birth-type.component'
      ).then(
        (m) =>
          m.BirthTypeComponent,
      ),
  },

  {
    path: 'onboarding/reminders',
    loadComponent: () =>
      import(
        './features/onboarding/reminders/reminders.component'
      ).then(
        (m) =>
          m.RemindersComponent,
      ),
  },

  {
    path: 'onboarding/complete',
    loadComponent: () =>
      import(
        './features/onboarding/complete/complete.component'
      ).then(
        (m) =>
          m.CompleteComponent,
      ),
  },

  {
    path: 'today',
    loadComponent: () =>
      import(
        './features/today/today/today.component'
      ).then(
        (m) =>
          m.TodayComponent,
      ),
  },

  {
    path: 'baby',
    loadComponent: () =>
      import(
        './features/baby/baby.component'
      ).then(
        (m) =>
          m.BabyComponent,
      ),
  },

  {
    path: 'baby/growth',
    loadComponent: () =>
      import(
        './features/growth/growth.component'
      ).then(
        (m) =>
          m.GrowthComponent,
      ),
  },

  {
    path: 'baby/growth/new',
    loadComponent: () =>
      import(
        './features/growth-form/growth-form.component'
      ).then(
        (m) =>
          m.GrowthFormComponent,
      ),
  },

  {
    path: 'baby/growth/:id/edit',
    loadComponent: () =>
      import(
        './features/growth-form/growth-form.component'
      ).then(
        (m) =>
          m.GrowthFormComponent,
      ),
  },

  {
    path: 'me',
    loadComponent: () =>
      import(
        './features/me/me.component'
      ).then(
        (m) =>
          m.MeComponent,
      ),
  },

  {
    path: 'me/recovery',
    loadComponent: () =>
      import(
        './features/recovery/recovery.component'
      ).then(
        (m) =>
          m.RecoveryComponent,
      ),
  },

  {
    path: 'me/recovery/new',
    loadComponent: () =>
      import(
        './features/recovery-form/recovery-form.component'
      ).then(
        (m) =>
          m.RecoveryFormComponent,
      ),
  },

  {
    path: 'me/recovery/:id/edit',
    loadComponent: () =>
      import(
        './features/recovery-form/recovery-form.component'
      ).then(
        (m) =>
          m.RecoveryFormComponent,
      ),
  },

  {
    path: 'more',
    loadComponent: () =>
      import(
        './features/more/more.component'
      ).then(
        (m) =>
          m.MoreComponent,
      ),
  },

  {
    path: 'pump',
    loadComponent: () =>
      import(
        './features/pump/pump.component'
      ).then(
        (m) =>
          m.PumpComponent,
      ),
  },

  {
    path: 'pumped-milk',
    loadComponent: () =>
      import(
        './features/pumped-milk/pumped-milk.component'
      ).then(
        (m) =>
          m.PumpedMilkComponent,
      ),
  },

  {
    path: 'feed',
    loadComponent: () =>
      import(
        './features/feed/feed.component'
      ).then(
        (m) =>
          m.FeedComponent,
      ),
  },

  {
    path: 'feed/breastfeed',
    loadComponent: () =>
      import(
        './features/breastfeed/breastfeed.component'
      ).then(
        (m) =>
          m.BreastfeedComponent,
      ),
  },

  {
    path: 'feed/pumped-milk',
    loadComponent: () =>
      import(
        './features/pumped-milk-feed/pumped-milk-feed.component'
      ).then(
        (m) =>
          m.PumpedMilkFeedComponent,
      ),
  },

  {
    path: 'feed/formula',
    loadComponent: () =>
      import(
        './features/formula-feed/formula-feed.component'
      ).then(
        (m) =>
          m.FormulaFeedComponent,
      ),
  },

  {
    path: 'feed/history',
    loadComponent: () =>
      import(
        './features/feeding-history/feeding-history.component'
      ).then(
        (m) =>
          m.FeedingHistoryComponent,
      ),
  },

  {
    path: 'diaper',
    loadComponent: () =>
      import(
        './features/diaper/diaper.component'
      ).then(
        (m) =>
          m.DiaperComponent,
      ),
  },

  {
    path: 'diaper/history',
    loadComponent: () =>
      import(
        './features/diaper-history/diaper-history.component'
      ).then(
        (m) =>
          m.DiaperHistoryComponent,
      ),
  },

  {
    path: 'sleep',
    loadComponent: () =>
      import(
        './features/sleep/sleep.component'
      ).then(
        (m) =>
          m.SleepComponent,
      ),
  },

  {
    path: 'sleep/history',
    loadComponent: () =>
      import(
        './features/sleep-history/sleep-history.component'
      ).then(
        (m) =>
          m.SleepHistoryComponent,
      ),
  },

  {
    path: 'appointments',
    loadComponent: () =>
      import(
        './features/appointments/appointments.component'
      ).then(
        (m) =>
          m.AppointmentsComponent,
      ),
  },

  {
    path: 'appointments/new',
    loadComponent: () =>
      import(
        './features/appointment-form/appointment-form.component'
      ).then(
        (m) =>
          m.AppointmentFormComponent,
      ),
  },

  {
    path: 'appointments/:id/edit',
    loadComponent: () =>
      import(
        './features/appointment-form/appointment-form.component'
      ).then(
        (m) =>
          m.AppointmentFormComponent,
      ),
  },

];