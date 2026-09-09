import {
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import {
  BottomNavComponent,
} from '../../../shared/bottom-nav/bottom-nav.component';

interface LastPumpSession {
  id: string;
  pumpedAt: string;
  amountMl: number | null;
  storageLocation:
    | 'room'
    | 'fridge'
    | 'freezer';
  notes: string;
  useBy: string;
  createdAt: string;
}

interface Appointment {
  id: string;
  kind:
    | 'appointment'
    | 'vaccination';
  title: string;
  forWho:
    | 'mama'
    | 'baby';
  date: string;
  time: string;
  location: string;
  notes: string;
  status:
    | 'scheduled'
    | 'completed'
    | 'cancelled';
  reminderOffset:
    | 'none'
    | '2-hours'
    | '1-day'
    | '1-week';
  prepareItems: string[];
  createdAt: string;
}

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [
    BottomNavComponent,
  ],
  templateUrl:
    './today.component.html',
  styleUrl:
    './today.component.scss',
})
export class TodayComponent
  implements OnInit, OnDestroy
{
  private readonly router =
    inject(Router);

  private routerSubscription:
    | Subscription
    | null = null;

  momName =
    localStorage.getItem(
      'mumma-bear:mom-name',
    ) || 'Mama';

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  babyAgeText =
    this.getBabyAgeText();

  babyWeekDayText =
    this.getBabyWeekDayText();

  lastPump:
    | LastPumpSession
    | null = null;

  nextAppointment:
    | Appointment
    | null = null;

  private currentTimestamp =
    Date.now();

  private timerId:
    | ReturnType<typeof setInterval>
    | null = null;


  ngOnInit(): void {
    this.loadTodayData();

    this.routerSubscription =
      this.router.events.subscribe(
        (event) => {
          if (
            event instanceof
              NavigationEnd &&
            event.urlAfterRedirects ===
              '/today'
          ) {
            this.loadTodayData();
          }
        },
      );

    this.timerId =
      setInterval(
        () => {
          this.currentTimestamp =
            Date.now();

          this.loadNextAppointment();
        },
        30_000,
      );
  }


  ngOnDestroy(): void {
    if (
      this.timerId !== null
    ) {
      clearInterval(
        this.timerId,
      );
    }

    this.routerSubscription
      ?.unsubscribe();
  }


  get lastPumpTime(): string {
    if (!this.lastPump) {
      return '';
    }

    const date =
      new Date(
        this.lastPump.pumpedAt,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return '';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
      },
    ).format(
      date,
    );
  }


  get lastPumpDateText():
    string {
    if (!this.lastPump) {
      return '';
    }

    const pumpDate =
      new Date(
        this.lastPump.pumpedAt,
      );

    if (
      Number.isNaN(
        pumpDate.getTime(),
      )
    ) {
      return '';
    }

    const today =
      new Date();

    pumpDate.setHours(
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

    const yesterday =
      new Date(
        today,
      );

    yesterday.setDate(
      yesterday.getDate() -
        1,
    );

    if (
      pumpDate.getTime() ===
      today.getTime()
    ) {
      return 'Today';
    }

    if (
      pumpDate.getTime() ===
      yesterday.getTime()
    ) {
      return 'Yesterday';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric',
      },
    ).format(
      pumpDate,
    );
  }


  get lastPumpExpiryTime():
    string {
    if (!this.lastPump) {
      return '';
    }

    const useBy =
      new Date(
        this.lastPump.useBy,
      );

    if (
      Number.isNaN(
        useBy.getTime(),
      )
    ) {
      return '';
    }

    const pumpedAt =
      new Date(
        this.lastPump.pumpedAt,
      );

    const sameDate =
      pumpedAt.getFullYear() ===
        useBy.getFullYear() &&
      pumpedAt.getMonth() ===
        useBy.getMonth() &&
      pumpedAt.getDate() ===
        useBy.getDate();

    if (sameDate) {
      return new Intl.DateTimeFormat(
        undefined,
        {
          hour: 'numeric',
          minute: '2-digit',
        },
      ).format(
        useBy,
      );
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      },
    ).format(
      useBy,
    );
  }


  get lastPumpRemainingTime():
    string {
    if (!this.lastPump) {
      return '';
    }

    const useBy =
      new Date(
        this.lastPump.useBy,
      );

    if (
      Number.isNaN(
        useBy.getTime(),
      )
    ) {
      return '';
    }

    const difference =
      useBy.getTime() -
      this.currentTimestamp;

    if (difference <= 0) {
      return 'Use-by time reached';
    }

    const totalMinutes =
      Math.floor(
        difference /
          60_000,
      );

    if (totalMinutes < 60) {
      return `${totalMinutes}m left`;
    }

    const totalHours =
      Math.floor(
        totalMinutes / 60,
      );

    const minutes =
      totalMinutes % 60;

    if (totalHours < 24) {
      if (minutes === 0) {
        return `${totalHours}h left`;
      }

      return `${totalHours}h ${minutes}m left`;
    }

    const days =
      Math.floor(
        totalHours / 24,
      );

    const hours =
      totalHours % 24;

    if (days < 60) {
      if (hours === 0) {
        return `${days}d left`;
      }

      return `${days}d ${hours}h left`;
    }

    const months =
      Math.floor(
        days / 30,
      );

    const remainingDays =
      days % 30;

    if (remainingDays === 0) {
      return `${months}m left`;
    }

    return `${months}m ${remainingDays}d left`;
  }


  get nextAppointmentOwnerText():
    string {
    if (!this.nextAppointment) {
      return '';
    }

    return this.nextAppointment
      .forWho === 'baby'
      ? `For ${this.babyName}`
      : 'For you';
  }


  get nextAppointmentDateText():
    string {
    if (!this.nextAppointment) {
      return '';
    }

    const date =
      new Date(
        `${this.nextAppointment.date}T00:00:00`,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return '';
    }

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0,
    );

    const compare =
      new Date(
        date,
      );

    compare.setHours(
      0,
      0,
      0,
      0,
    );

    if (
      compare.getTime() ===
      today.getTime()
    ) {
      return 'Today';
    }

    const tomorrow =
      new Date(
        today,
      );

    tomorrow.setDate(
      tomorrow.getDate() +
        1,
    );

    if (
      compare.getTime() ===
      tomorrow.getTime()
    ) {
      return 'Tomorrow';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      },
    ).format(
      date,
    );
  }


  get nextAppointmentTimeText():
    string {
    if (!this.nextAppointment) {
      return '';
    }

    const [
      hoursValue,
      minutesValue,
    ] =
      this.nextAppointment
        .time
        .split(':');

    const date =
      new Date();

    date.setHours(
      Number(hoursValue),
      Number(minutesValue),
      0,
      0,
    );

    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
      },
    ).format(
      date,
    );
  }


  goToPump(): void {
    void this.router.navigate(
      ['/pump'],
    );
  }

  goToFeed(): void {
    void this.router.navigate(
      ['/feed'],
    );
  }

  goToDiaper(): void {
    void this.router.navigate(
      ['/diaper'],
    );
  }

  goToSleep(): void {
    void this.router.navigate(
      ['/sleep'],
    );
  }

  goToAppointments():
    void {
    void this.router.navigate(
      ['/appointments'],
    );
  }


  onLastPumpKeydown(
    event: KeyboardEvent,
  ): void {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();

      this.goToPump();
    }
  }


  onNextAppointmentKeydown(
    event: KeyboardEvent,
  ): void {
    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();

      this.goToAppointments();
    }
  }


  private loadTodayData():
    void {
    this.loadLastPump();
    this.loadNextAppointment();
  }


  private loadNextAppointment():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:appointments',
      );

    if (!stored) {
      this.nextAppointment =
        null;

      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        );

      if (!Array.isArray(parsed)) {
        this.nextAppointment =
          null;

        return;
      }

      const now =
        Date.now();

      const upcoming =
        (
          parsed as Appointment[]
        )
          .filter(
            (
              appointment,
            ) => {
              if (
                appointment.status !==
                'scheduled'
              ) {
                return false;
              }

              const timestamp =
                new Date(
                  `${appointment.date}T${appointment.time || '00:00'}:00`,
                ).getTime();

              return (
                !Number.isNaN(
                  timestamp,
                ) &&
                timestamp >= now
              );
            },
          )
          .sort(
            (a, b) =>
              new Date(
                `${a.date}T${a.time || '00:00'}:00`,
              ).getTime() -
              new Date(
                `${b.date}T${b.time || '00:00'}:00`,
              ).getTime(),
          );

      this.nextAppointment =
        upcoming[0] ??
        null;
    } catch {
      this.nextAppointment =
        null;
    }
  }


  private loadLastPump():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:last-pump',
      );

    if (!stored) {
      this.lastPump =
        null;

      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        ) as LastPumpSession;

      if (
        !parsed ||
        !parsed.pumpedAt ||
        !parsed.useBy
      ) {
        this.lastPump =
          null;

        return;
      }

      this.lastPump =
        parsed;

      this.currentTimestamp =
        Date.now();
    } catch {
      this.lastPump =
        null;
    }
  }


  private getBabyAgeInDays():
    | number
    | null {
    const dobValue =
      localStorage.getItem(
        'mumma-bear:baby-dob',
      );

    if (!dobValue) {
      return null;
    }

    const dob =
      new Date(
        `${dobValue}T00:00:00`,
      );

    const today =
      new Date();

    dob.setHours(
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

    const diffMs =
      today.getTime() -
      dob.getTime();

    const ageInDays =
      Math.floor(
        diffMs /
          (
            1000 *
            60 *
            60 *
            24
          ),
      );

    return Math.max(
      0,
      ageInDays,
    );
  }


  private getBabyAgeText():
    string {
    const ageInDays =
      this.getBabyAgeInDays();

    if (ageInDays === null) {
      return '';
    }

    if (ageInDays === 0) {
      return 'born today';
    }

    if (ageInDays === 1) {
      return '1 day old';
    }

    return `${ageInDays} days old`;
  }


  private getBabyWeekDayText():
    string {
    const ageInDays =
      this.getBabyAgeInDays();

    if (ageInDays === null) {
      return '';
    }

    const week =
      Math.floor(
        ageInDays / 7,
      ) + 1;

    const day =
      (
        ageInDays % 7
      ) + 1;

    return `Week ${week} • Day ${day}`;
  }
}