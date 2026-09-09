import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BottomNavComponent,
} from '../../shared/bottom-nav/bottom-nav.component';

interface Appointment {
  id: string;
  kind:
    | 'appointment'
    | 'vaccination';
  forWho:
    | 'mama'
    | 'baby';
  status:
    | 'scheduled'
    | 'completed'
    | 'cancelled';
  date: string;
  time: string;
}

@Component({
  selector: 'app-baby',
  standalone: true,
  imports: [
    BottomNavComponent,
  ],
  templateUrl:
    './baby.component.html',
  styleUrl:
    './baby.component.scss',
})
export class BabyComponent
  implements OnInit
{
  private readonly router =
    inject(Router);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  babyAgeText =
    '';

  babyDobText =
    '';

  feedingCount =
    0;

  diaperCount =
    0;

  sleepCount =
    0;

  upcomingVaccinations =
    0;


  ngOnInit(): void {
    this.loadBabyProfile();

    this.feedingCount =
      this.getArrayLength(
        'mumma-bear:feeding-sessions',
      );

    this.diaperCount =
      this.getArrayLength(
        'mumma-bear:diaper-sessions',
      );

    this.sleepCount =
      this.getArrayLength(
        'mumma-bear:sleep-sessions',
      );

    this.loadVaccinations();
  }


  openFeeding(): void {
    void this.router.navigate(
      ['/feed/history'],
    );
  }


  openDiapers(): void {
    void this.router.navigate(
      ['/diaper/history'],
    );
  }


  openSleep(): void {
    void this.router.navigate(
      ['/sleep/history'],
    );
  }


  openVaccinations(): void {
    void this.router.navigate(
      ['/appointments'],
      {
        queryParams: {
          tab:
            'vaccinations',
        },
      },
    );
  }


  private loadBabyProfile():
    void {
    const dob =
      localStorage.getItem(
        'mumma-bear:baby-dob',
      );

    if (!dob) {
      return;
    }

    const date =
      new Date(
        `${dob}T00:00:00`,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return;
    }

    this.babyDobText =
      new Intl.DateTimeFormat(
        undefined,
        {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        },
      ).format(
        date,
      );

    const today =
      new Date();

    date.setHours(
      0,
      0,
      0,
      0,
    );

    today.setHours(
      0,
      0,
      0,
      0,
    );

    const days =
      Math.max(
        0,
        Math.floor(
          (
            today.getTime() -
            date.getTime()
          ) /
          86_400_000,
        ),
      );

    if (days === 0) {
      this.babyAgeText =
        'Born today';

      return;
    }

    if (days < 7) {
      this.babyAgeText =
        `${days} ${
          days === 1
            ? 'day'
            : 'days'
        } old`;

      return;
    }

    const weeks =
      Math.floor(
        days / 7,
      );

    this.babyAgeText =
      `${weeks} ${
        weeks === 1
          ? 'week'
          : 'weeks'
      } old`;
  }


  private loadVaccinations():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:appointments',
      );

    if (!stored) {
      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        ) as Appointment[];

      if (
        !Array.isArray(
          parsed,
        )
      ) {
        return;
      }

      const now =
        Date.now();

      this.upcomingVaccinations =
        parsed.filter(
          (
            appointment,
          ) => {
            const time =
              new Date(
                `${appointment.date}T${appointment.time || '00:00'}:00`,
              ).getTime();

            return (
              appointment.kind ===
                'vaccination' &&
              appointment.forWho ===
                'baby' &&
              appointment.status ===
                'scheduled' &&
              time >= now
            );
          },
        ).length;
    } catch {
      this.upcomingVaccinations =
        0;
    }
  }


  private getArrayLength(
    key: string,
  ): number {
    const stored =
      localStorage.getItem(
        key,
      );

    if (!stored) {
      return 0;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        );

      return Array.isArray(
        parsed,
      )
        ? parsed.length
        : 0;
    } catch {
      return 0;
    }
  }
}