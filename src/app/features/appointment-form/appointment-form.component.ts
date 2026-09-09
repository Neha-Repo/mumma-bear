import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

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

type ReminderOffset =
  | 'none'
  | '2-hours'
  | '1-day'
  | '1-week';

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
    ReminderOffset;
  prepareItems: string[];
  createdAt: string;
}

interface PrepareOption {
  label: string;
  selected: boolean;
}

@Component({
  selector:
    'app-appointment-form',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl:
    './appointment-form.component.html',
  styleUrl:
    './appointment-form.component.scss',
})
export class AppointmentFormComponent
  implements OnInit
{
  private router =
    inject(Router);

  private route =
    inject(ActivatedRoute);

  appointmentId:
    string | null = null;

  isEditing =
    false;

  isSaved =
    false;

  kind:
    AppointmentKind =
      'appointment';

  title = '';

  forWho:
    AppointmentOwner =
      'mama';

  date =
    this.todayDateValue();

  time =
    this.currentTimeValue();

  location = '';

  notes = '';

  reminderOffset:
    ReminderOffset =
      '1-day';

  prepareEnabled =
    false;

  prepareOptions:
    PrepareOption[] = [];


  ngOnInit(): void {
    this.appointmentId =
      this.route.snapshot
        .paramMap
        .get('id');

    this.isEditing =
      Boolean(
        this.appointmentId,
      );

    if (
      this.isEditing &&
      this.appointmentId
    ) {
      this.loadAppointment(
        this.appointmentId,
      );
    } else {
      this.configurePrepareOptions();
    }
  }


  get pageTitle(): string {
    return this.isEditing
      ? 'Edit appointment'
      : 'Add appointment';
  }


  get saveLabel(): string {
    if (this.isSaved) {
      return 'Saved';
    }

    return this.isEditing
      ? 'Save changes'
      : 'Save appointment';
  }


  get canSave(): boolean {
    return Boolean(
      this.title.trim() &&
      this.date &&
      this.time,
    );
  }


  selectKind(
    kind:
      AppointmentKind,
  ): void {
    this.kind =
      kind;

    if (
      kind ===
      'vaccination'
    ) {
      this.forWho =
        'baby';

      if (
        !this.title.trim()
      ) {
        this.title =
          'Vaccination';
      }

      if (
        this.reminderOffset ===
        'none'
      ) {
        this.reminderOffset =
          '1-day';
      }
    }

    this.configurePrepareOptions();
  }


  selectOwner(
    owner:
      AppointmentOwner,
  ): void {
    if (
      this.kind ===
      'vaccination'
    ) {
      this.forWho =
        'baby';

      return;
    }

    this.forWho =
      owner;

    this.configurePrepareOptions();
  }


  selectReminder(
    reminder:
      ReminderOffset,
  ): void {
    this.reminderOffset =
      reminder;
  }


  togglePrepare(): void {
    this.prepareEnabled =
      !this.prepareEnabled;

    if (
      this.prepareEnabled &&
      this.prepareOptions.length ===
        0
    ) {
      this.configurePrepareOptions();
    }
  }


  togglePrepareItem(
    option:
      PrepareOption,
  ): void {
    option.selected =
      !option.selected;
  }


  saveAppointment(): void {
    if (
      !this.canSave ||
      this.isSaved
    ) {
      return;
    }

    const appointments =
      this.loadAppointments();

    const existingIndex =
      this.appointmentId
        ? appointments.findIndex(
            (appointment) =>
              appointment.id ===
              this.appointmentId,
          )
        : -1;

    const existing =
      existingIndex >= 0
        ? appointments[
            existingIndex
          ]
        : null;

    const appointment:
      Appointment = {
        id:
          existing?.id ??
          this.createId(),

        kind:
          this.kind,

        title:
          this.title.trim(),

        forWho:
          this.kind ===
          'vaccination'
            ? 'baby'
            : this.forWho,

        date:
          this.date,

        time:
          this.time,

        location:
          this.location.trim(),

        notes:
          this.notes.trim(),

        status:
          existing?.status ??
          'scheduled',

        reminderOffset:
          this.reminderOffset,

        prepareItems:
          this.prepareEnabled
            ? this.prepareOptions
                .filter(
                  (option) =>
                    option.selected,
                )
                .map(
                  (option) =>
                    option.label,
                )
            : [],

        createdAt:
          existing?.createdAt ??
          new Date()
            .toISOString(),
      };

    if (
      existingIndex >= 0
    ) {
      appointments[
        existingIndex
      ] =
        appointment;
    } else {
      appointments.unshift(
        appointment,
      );
    }

    localStorage.setItem(
      'mumma-bear:appointments',
      JSON.stringify(
        appointments,
      ),
    );

    this.isSaved =
      true;

    setTimeout(
      () => {
        void this.router.navigate(
          ['/appointments'],
        );
      },
      350,
    );
  }


  deleteAppointment():
    void {
    if (
      !this.appointmentId
    ) {
      return;
    }

    const appointments =
      this.loadAppointments()
        .filter(
          (appointment) =>
            appointment.id !==
            this.appointmentId,
        );

    localStorage.setItem(
      'mumma-bear:appointments',
      JSON.stringify(
        appointments,
      ),
    );

    void this.router.navigate(
      ['/appointments'],
    );
  }


  goBack(): void {
    void this.router.navigate(
      ['/appointments'],
    );
  }


  private configurePrepareOptions():
    void {
    const selected =
      new Set(
        this.prepareOptions
          .filter(
            (option) =>
              option.selected,
          )
          .map(
            (option) =>
              option.label,
          ),
      );

    let labels:
      string[] = [];

    if (
      this.kind ===
      'vaccination'
    ) {
      labels = [
        'Baby health record',
        'Feeding essentials',
        'Questions or concerns',
      ];
    } else if (
      this.forWho ===
      'mama'
    ) {
      labels = [
        'Health card or ID',
        'Medication list',
        'Questions or concerns',
      ];
    } else {
      labels = [
        'Baby health record',
        'Feeding notes',
        'Questions or concerns',
      ];
    }

    this.prepareOptions =
      labels.map(
        (label) => ({
          label,

          selected:
            selected.has(
              label,
            ),
        }),
      );
  }


  private loadAppointment(
    id: string,
  ): void {
    const appointment =
      this.loadAppointments()
        .find(
          (item) =>
            item.id ===
            id,
        );

    if (!appointment) {
      void this.router.navigate(
        ['/appointments'],
      );

      return;
    }

    this.kind =
      appointment.kind;

    this.title =
      appointment.title;

    this.forWho =
      appointment.forWho;

    this.date =
      appointment.date;

    this.time =
      appointment.time;

    this.location =
      appointment.location;

    this.notes =
      appointment.notes;

    this.reminderOffset =
      appointment.reminderOffset;

    this.prepareEnabled =
      appointment.prepareItems
        .length >
      0;

    this.configurePrepareOptions();

    const selectedItems =
      new Set(
        appointment
          .prepareItems,
      );

    this.prepareOptions =
      this.prepareOptions.map(
        (option) => ({
          ...option,

          selected:
            selectedItems.has(
              option.label,
            ),
        }),
      );
  }


  private loadAppointments():
    Appointment[] {
    const stored =
      localStorage.getItem(
        'mumma-bear:appointments',
      );

    if (!stored) {
      return [];
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        );

      return Array.isArray(
        parsed,
      )
        ? parsed
        : [];
    } catch {
      return [];
    }
  }


  private todayDateValue():
    string {
    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      (
        now.getMonth() +
        1
      )
        .toString()
        .padStart(
          2,
          '0',
        );

    const day =
      now
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


  private createId(): string {
    if (
      typeof crypto !==
        'undefined' &&
      'randomUUID' in crypto
    ) {
      return crypto.randomUUID();
    }

    return `appointment-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }
}