import {
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

import {
  BottomNavComponent,
} from '../../shared/bottom-nav/bottom-nav.component';

type AppointmentTab =
  | 'appointments'
  | 'vaccinations'
  | 'reminders';

type AppointmentKind =
  | 'appointment'
  | 'vaccination';

type AppointmentOwner =
  | 'mama'
  | 'baby';

type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled';

type ReminderRepeat =
  | 'once'
  | 'daily'
  | 'weekly';

interface Appointment {
  id: string;
  kind: AppointmentKind;
  title: string;
  forWho: AppointmentOwner;
  date: string;
  time: string;
  location: string;
  notes: string;
  status: AppointmentStatus;
  reminderOffset:
    | 'none'
    | '2-hours'
    | '1-day'
    | '1-week';
  prepareItems: string[];
  createdAt: string;
}

interface Reminder {
  id: string;
  title: string;
  forWho: AppointmentOwner;
  date: string;
  time: string;
  repeat: ReminderRepeat;
  enabled: boolean;
  createdAt: string;
}

interface AppointmentReminderView {
  id: string;
  appointmentId: string;
  kind: AppointmentKind;
  title: string;
  forWho: AppointmentOwner;
  reminderText: string;
  appointmentDate: string;
  appointmentTime: string;
  enabled: boolean;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    FormsModule,
    BottomNavComponent,
  ],
  templateUrl:
    './appointments.component.html',
  styleUrl:
    './appointments.component.scss',
})
export class AppointmentsComponent
  implements OnInit, OnDestroy
{
  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  private querySubscription:
    | Subscription
    | null = null;

  activeTab:
    AppointmentTab =
      'appointments';

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  appointments:
    Appointment[] = [];

  reminders:
    Reminder[] = [];

  showReminderForm =
    false;

  reminderTitle = '';

  reminderForWho:
    AppointmentOwner =
      'mama';

  reminderDate =
    this.todayDateValue();

  reminderTime =
    this.currentTimeValue();

  reminderRepeat:
    ReminderRepeat =
      'once';


  ngOnInit(): void {
    this.loadAppointments();
    this.loadReminders();

    this.querySubscription =
      this.route.queryParamMap
        .subscribe(
          (params) => {
            const requestedTab =
              params.get('tab');

            if (
              requestedTab ===
                'vaccinations' ||
              requestedTab ===
                'reminders' ||
              requestedTab ===
                'appointments'
            ) {
              this.activeTab =
                requestedTab;

              return;
            }

            this.activeTab =
              'appointments';
          },
        );
  }


  ngOnDestroy(): void {
    this.querySubscription
      ?.unsubscribe();
  }


  get upcomingAppointments():
    Appointment[] {
    return this.appointments
      .filter(
        (appointment) =>
          appointment.kind ===
            'appointment' &&
          appointment.status ===
            'scheduled' &&
          !this.isPast(
            appointment,
          ),
      )
      .sort(
        (
          a,
          b,
        ) =>
          this.getAppointmentTimestamp(
            a,
          ) -
          this.getAppointmentTimestamp(
            b,
          ),
      );
  }


  get pastAppointments():
    Appointment[] {
    return this.appointments
      .filter(
        (appointment) =>
          appointment.kind ===
            'appointment' &&
          (
            appointment.status !==
              'scheduled' ||
            this.isPast(
              appointment,
            )
          ),
      )
      .sort(
        (
          a,
          b,
        ) =>
          this.getAppointmentTimestamp(
            b,
          ) -
          this.getAppointmentTimestamp(
            a,
          ),
      );
  }


  get upcomingVaccinations():
    Appointment[] {
    return this.appointments
      .filter(
        (appointment) =>
          appointment.kind ===
            'vaccination' &&
          appointment.status ===
            'scheduled' &&
          !this.isPast(
            appointment,
          ),
      )
      .sort(
        (
          a,
          b,
        ) =>
          this.getAppointmentTimestamp(
            a,
          ) -
          this.getAppointmentTimestamp(
            b,
          ),
      );
  }


  get pastVaccinations():
    Appointment[] {
    return this.appointments
      .filter(
        (appointment) =>
          appointment.kind ===
            'vaccination' &&
          (
            appointment.status !==
              'scheduled' ||
            this.isPast(
              appointment,
            )
          ),
      )
      .sort(
        (
          a,
          b,
        ) =>
          this.getAppointmentTimestamp(
            b,
          ) -
          this.getAppointmentTimestamp(
            a,
          ),
      );
  }


  get appointmentReminders():
    AppointmentReminderView[] {
    return this.appointments
      .filter(
        (appointment) =>
          appointment.status ===
            'scheduled' &&
          appointment.reminderOffset !==
            'none' &&
          !this.isPast(
            appointment,
          ),
      )
      .sort(
        (
          a,
          b,
        ) =>
          this.getAppointmentTimestamp(
            a,
          ) -
          this.getAppointmentTimestamp(
            b,
          ),
      )
      .map(
        (
          appointment,
        ) => ({
          id:
            `appointment-${appointment.id}`,

          appointmentId:
            appointment.id,

          kind:
            appointment.kind,

          title:
            appointment.title,

          forWho:
            appointment.forWho,

          reminderText:
            this.getReminderLabel(
              appointment
                .reminderOffset,
            ),

          appointmentDate:
            appointment.date,

          appointmentTime:
            appointment.time,

          enabled:
            true,
        }),
      );
  }


  get activeCustomReminders():
    Reminder[] {
    return [...this.reminders]
      .sort(
        (
          a,
          b,
        ) =>
          this.getReminderTimestamp(
            a,
          ) -
          this.getReminderTimestamp(
            b,
          ),
      );
  }


  selectTab(
    tab: AppointmentTab,
  ): void {
    this.activeTab =
      tab;

    this.showReminderForm =
      false;

    if (
      tab ===
      'appointments'
    ) {
      void this.router.navigate(
        [],
        {
          relativeTo:
            this.route,

          queryParams: {},

          replaceUrl:
            true,
        },
      );

      return;
    }

    void this.router.navigate(
      [],
      {
        relativeTo:
          this.route,

        queryParams: {
          tab,
        },

        replaceUrl:
          true,
      },
    );
  }


  goBack(): void {
    void this.router.navigate(
      ['/today'],
    );
  }


  addAppointment(): void {
    void this.router.navigate(
      ['/appointments/new'],
    );
  }


  editAppointment(
    appointment:
      Appointment,
  ): void {
    void this.router.navigate(
      [
        '/appointments',
        appointment.id,
        'edit',
      ],
    );
  }


  markCompleted(
    appointment:
      Appointment,
    event: Event,
  ): void {
    event.stopPropagation();

    appointment.status =
      'completed';

    this.saveAppointments();
  }


  restoreAppointment(
    appointment:
      Appointment,
    event: Event,
  ): void {
    event.stopPropagation();

    appointment.status =
      'scheduled';

    this.saveAppointments();
  }


  openReminderForm(): void {
    this.reminderTitle =
      '';

    this.reminderForWho =
      'mama';

    this.reminderDate =
      this.todayDateValue();

    this.reminderTime =
      this.currentTimeValue();

    this.reminderRepeat =
      'once';

    this.showReminderForm =
      true;
  }


  cancelReminderForm(): void {
    this.showReminderForm =
      false;
  }


  saveReminder(): void {
    const title =
      this.reminderTitle
        .trim();

    if (!title) {
      return;
    }

    const reminder:
      Reminder = {
        id:
          this.createId(
            'reminder',
          ),

        title,

        forWho:
          this.reminderForWho,

        date:
          this.reminderDate,

        time:
          this.reminderTime,

        repeat:
          this.reminderRepeat,

        enabled:
          true,

        createdAt:
          new Date()
            .toISOString(),
      };

    this.reminders.unshift(
      reminder,
    );

    this.saveReminders();

    this.showReminderForm =
      false;
  }


  toggleReminder(
    reminder:
      Reminder,
  ): void {
    reminder.enabled =
      !reminder.enabled;

    this.saveReminders();
  }


  deleteReminder(
    reminder:
      Reminder,
  ): void {
    this.reminders =
      this.reminders.filter(
        (item) =>
          item.id !==
          reminder.id,
      );

    this.saveReminders();
  }


  disableAppointmentReminder(
    reminder:
      AppointmentReminderView,
  ): void {
    const appointment =
      this.appointments.find(
        (item) =>
          item.id ===
          reminder.appointmentId,
      );

    if (!appointment) {
      return;
    }

    appointment.reminderOffset =
      'none';

    this.saveAppointments();
  }


  getOwnerLabel(
    forWho:
      AppointmentOwner,
  ): string {
    if (
      forWho ===
      'baby'
    ) {
      return this.babyName;
    }

    return 'You';
  }


  getDateLabel(
    appointment:
      Appointment,
  ): string {
    const date =
      this.parseDate(
        appointment.date,
      );

    if (!date) {
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
        month:
          'short',

        day:
          'numeric',

        year:
          'numeric',
      },
    ).format(
      date,
    );
  }


  getTimeLabel(
    time: string,
  ): string {
    if (!time) {
      return '';
    }

    const [
      hoursValue,
      minutesValue,
    ] =
      time.split(':');

    const date =
      new Date();

    date.setHours(
      Number(
        hoursValue,
      ),
      Number(
        minutesValue,
      ),
      0,
      0,
    );

    return new Intl.DateTimeFormat(
      undefined,
      {
        hour:
          'numeric',

        minute:
          '2-digit',
      },
    ).format(
      date,
    );
  }


  getReminderDateLabel(
    reminder:
      Reminder,
  ): string {
    if (
      reminder.repeat ===
      'daily'
    ) {
      return 'Daily';
    }

    if (
      reminder.repeat ===
      'weekly'
    ) {
      return 'Weekly';
    }

    const date =
      this.parseDate(
        reminder.date,
      );

    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month:
          'short',

        day:
          'numeric',

        year:
          'numeric',
      },
    ).format(
      date,
    );
  }


  getRepeatLabel(
    repeat:
      ReminderRepeat,
  ): string {
    if (
      repeat ===
      'daily'
    ) {
      return 'Every day';
    }

    if (
      repeat ===
      'weekly'
    ) {
      return 'Every week';
    }

    return 'One-time';
  }


  private loadAppointments():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:appointments',
      );

    if (!stored) {
      this.appointments =
        [];

      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        );

      this.appointments =
        Array.isArray(
          parsed,
        )
          ? parsed
          : [];
    } catch {
      this.appointments =
        [];
    }
  }


  private saveAppointments():
    void {
    localStorage.setItem(
      'mumma-bear:appointments',
      JSON.stringify(
        this.appointments,
      ),
    );
  }


  private loadReminders():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:reminders',
      );

    if (!stored) {
      this.reminders =
        [];

      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        );

      this.reminders =
        Array.isArray(
          parsed,
        )
          ? parsed
          : [];
    } catch {
      this.reminders =
        [];
    }
  }


  private saveReminders():
    void {
    localStorage.setItem(
      'mumma-bear:reminders',
      JSON.stringify(
        this.reminders,
      ),
    );
  }


  private isPast(
    appointment:
      Appointment,
  ): boolean {
    const timestamp =
      this.getAppointmentTimestamp(
        appointment,
      );

    if (
      timestamp === 0
    ) {
      return false;
    }

    return (
      timestamp <
      Date.now()
    );
  }


  private getAppointmentTimestamp(
    appointment:
      Appointment,
  ): number {
    const date =
      new Date(
        `${appointment.date}T${appointment.time || '00:00'}:00`,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return 0;
    }

    return date.getTime();
  }


  private getReminderTimestamp(
    reminder:
      Reminder,
  ): number {
    if (
      reminder.repeat !==
      'once'
    ) {
      return 0;
    }

    const date =
      new Date(
        `${reminder.date}T${reminder.time || '00:00'}:00`,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return 0;
    }

    return date.getTime();
  }


  private getReminderLabel(
    offset:
      Appointment[
        'reminderOffset'
      ],
  ): string {
    switch (offset) {
      case '2-hours':
        return '2 hours before';

      case '1-day':
        return '1 day before';

      case '1-week':
        return '1 week before';

      default:
        return 'No reminder';
    }
  }


  private parseDate(
    value: string,
  ): Date | null {
    if (!value) {
      return null;
    }

    const date =
      new Date(
        `${value}T00:00:00`,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return null;
    }

    return date;
  }


  private todayDateValue():
    string {
    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      (
        today.getMonth() +
        1
      )
        .toString()
        .padStart(
          2,
          '0',
        );

    const day =
      today
        .getDate()
        .toString()
        .padStart(
          2,
          '0',
        );

    return `${year}-${month}-${day}`;
  }


  private currentTimeValue():
    string {
    const now =
      new Date();

    const hours =
      now
        .getHours()
        .toString()
        .padStart(
          2,
          '0',
        );

    const minutes =
      now
        .getMinutes()
        .toString()
        .padStart(
          2,
          '0',
        );

    return `${hours}:${minutes}`;
  }


  private createId(
    prefix: string,
  ): string {
    if (
      typeof crypto !==
        'undefined' &&
      'randomUUID' in
        crypto
    ) {
      return crypto.randomUUID();
    }

    return `${prefix}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }
}