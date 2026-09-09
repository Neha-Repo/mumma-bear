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

interface RecoveryCheckIn {
  id: string;
  date: string;
}

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [
    BottomNavComponent,
  ],
  templateUrl:
    './me.component.html',
  styleUrl:
    './me.component.scss',
})
export class MeComponent
  implements OnInit
{
  private readonly router =
    inject(Router);

  momName =
    localStorage.getItem(
      'mumma-bear:mom-name',
    ) || 'Mama';

  upcomingAppointments =
    0;

  recoveryCheckIns =
    0;

  latestRecoveryDate =
    'No check-ins yet';


  ngOnInit(): void {
    this.loadAppointments();
    this.loadRecovery();
  }


  openRecovery(): void {
    void this.router.navigate(
      ['/me/recovery'],
    );
  }


  openAppointments(): void {
    void this.router.navigate(
      ['/appointments'],
      {
        queryParams: {
          tab:
            'appointments',
        },
      },
    );
  }


  private loadRecovery():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:recovery-checkins',
      );

    if (!stored) {
      this.recoveryCheckIns =
        0;

      this.latestRecoveryDate =
        'No check-ins yet';

      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        );

      if (
        !Array.isArray(
          parsed,
        )
      ) {
        return;
      }

      const entries =
        (
          parsed as RecoveryCheckIn[]
        )
          .filter(
            (
              entry,
            ) =>
              Boolean(
                entry?.id &&
                entry?.date,
              ),
          )
          .sort(
            (
              a,
              b,
            ) =>
              this.getDateTimestamp(
                b.date,
              ) -
              this.getDateTimestamp(
                a.date,
              ),
          );

      this.recoveryCheckIns =
        entries.length;

      if (
        entries.length > 0
      ) {
        this.latestRecoveryDate =
          `Last check-in ${this.formatShortDate(
            entries[0].date,
          )}`;
      } else {
        this.latestRecoveryDate =
          'No check-ins yet';
      }
    } catch {
      this.recoveryCheckIns =
        0;

      this.latestRecoveryDate =
        'No check-ins yet';
    }
  }


  private loadAppointments():
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

      this.upcomingAppointments =
        parsed.filter(
          (
            appointment,
          ) => {
            const timestamp =
              new Date(
                `${appointment.date}T${appointment.time || '00:00'}:00`,
              ).getTime();

            return (
              appointment.kind ===
                'appointment' &&
              appointment.forWho ===
                'mama' &&
              appointment.status ===
                'scheduled' &&
              timestamp >= now
            );
          },
        ).length;
    } catch {
      this.upcomingAppointments =
        0;
    }
  }


  private formatShortDate(
    value: string,
  ): string {
    const date =
      new Date(
        `${value}T00:00:00`,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return value;
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric',
      },
    ).format(
      date,
    );
  }


  private getDateTimestamp(
    value: string,
  ): number {
    const timestamp =
      new Date(
        `${value}T00:00:00`,
      ).getTime();

    return Number.isNaN(
      timestamp,
    )
      ? 0
      : timestamp;
  }
}