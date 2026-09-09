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


  ngOnInit(): void {
    this.loadAppointments();
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
}