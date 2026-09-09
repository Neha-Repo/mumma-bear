import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormsModule,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

type RecoveryFeeling =
  | ''
  | 'better'
  | 'same'
  | 'worse';

type RecoveryFlag =
  | ''
  | 'none'
  | 'pain'
  | 'bleeding'
  | 'feeding'
  | 'tired'
  | 'mood'
  | 'other';

type BleedingLevel =
  | ''
  | 'none'
  | 'light'
  | 'moderate'
  | 'heavy';

interface RecoveryCheckIn {
  id: string;
  date: string;

  feeling?: RecoveryFeeling;
  flag?: RecoveryFlag;

  discomfortLevel:
    number | null;

  energyLevel:
    number | null;

  bleeding:
    BleedingLevel;

  recoveryNotes: string;
  medicationNotes: string;
  notes: string;
  createdAt: string;
}

@Component({
  selector:
    'app-recovery-form',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl:
    './recovery-form.component.html',
  styleUrl:
    './recovery-form.component.scss',
})
export class RecoveryFormComponent
  implements OnInit
{
  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  private readonly storageKey =
    'mumma-bear:recovery-checkins';

  momName =
    localStorage.getItem(
      'mumma-bear:mom-name',
    ) || 'Mama';

  entryId:
    string | null =
      null;

  isEditing =
    false;

  date =
    this.getToday();

  feeling:
    RecoveryFeeling =
      '';

  flag:
    RecoveryFlag =
      '';

  notes =
    '';

  showNote =
    false;

  showDate =
    false;

  showDeleteConfirmation =
    false;

  showValidation =
    false;

  isLegacyEntry =
    false;

  private originalEntry:
    RecoveryCheckIn | null =
      null;


  ngOnInit(): void {
    this.entryId =
      this.route.snapshot
        .paramMap.get(
          'id',
        );

    this.isEditing =
      Boolean(
        this.entryId,
      );

    this.showDate =
      this.isEditing;

    if (
      this.entryId
    ) {
      this.loadEntry(
        this.entryId,
      );
    }
  }


  goBack(): void {
    void this.router.navigate(
      ['/me/recovery'],
    );
  }


  selectFeeling(
    value: RecoveryFeeling,
  ): void {
    this.feeling =
      value;

    this.showValidation =
      false;
  }


  selectFlag(
    value: RecoveryFlag,
  ): void {
    this.flag =
      this.flag === value
        ? ''
        : value;
  }


  toggleNote(): void {
    this.showNote =
      !this.showNote;
  }


  toggleDate(): void {
    this.showDate =
      !this.showDate;
  }


  save(): void {
    this.showValidation =
      true;

    if (
      !this.date ||
      !this.feeling
    ) {
      return;
    }

    const entries =
      this.loadEntries();

    if (
      this.isEditing &&
      this.entryId
    ) {
      const existingIndex =
        entries.findIndex(
          (
            entry,
          ) =>
            entry.id ===
            this.entryId,
        );

      if (
        existingIndex >= 0
      ) {
        const existing =
          entries[
            existingIndex
          ];

        entries[
          existingIndex
        ] = {
          ...existing,

          date:
            this.date,

          feeling:
            this.feeling,

          flag:
            this.flag,

          notes:
            this.notes.trim(),

          createdAt:
            existing.createdAt,
        };
      }
    } else {
      entries.push({
        id:
          this.createId(),

        date:
          this.date,

        feeling:
          this.feeling,

        flag:
          this.flag,

        discomfortLevel:
          null,

        energyLevel:
          null,

        bleeding:
          '',

        recoveryNotes:
          '',

        medicationNotes:
          '',

        notes:
          this.notes.trim(),

        createdAt:
          new Date()
            .toISOString(),
      });
    }

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(
        entries,
      ),
    );

    void this.router.navigate(
      ['/me/recovery'],
    );
  }


  requestDelete(): void {
    this.showDeleteConfirmation =
      true;
  }


  cancelDelete(): void {
    this.showDeleteConfirmation =
      false;
  }


  confirmDelete(): void {
    if (
      !this.entryId
    ) {
      return;
    }

    const entries =
      this.loadEntries()
        .filter(
          (
            entry,
          ) =>
            entry.id !==
            this.entryId,
        );

    localStorage.setItem(
      this.storageKey,
      JSON.stringify(
        entries,
      ),
    );

    void this.router.navigate(
      ['/me/recovery'],
    );
  }


  private loadEntry(
    id: string,
  ): void {
    const entry =
      this.loadEntries()
        .find(
          (
            item,
          ) =>
            item.id === id,
        );

    if (!entry) {
      void this.router.navigate(
        ['/me/recovery'],
      );

      return;
    }

    this.originalEntry =
      entry;

    this.date =
      entry.date;

    this.feeling =
      entry.feeling || '';

    this.flag =
      entry.flag || '';

    this.notes =
      entry.notes || '';

    this.showNote =
      Boolean(
        this.notes,
      );

    this.isLegacyEntry =
      !entry.feeling &&
      this.hasLegacyDetails(
        entry,
      );
  }


  private hasLegacyDetails(
    entry: RecoveryCheckIn,
  ): boolean {
    return Boolean(
      entry.discomfortLevel !==
        null ||
      entry.energyLevel !==
        null ||
      entry.bleeding ||
      entry.recoveryNotes ||
      entry.medicationNotes,
    );
  }


  private loadEntries():
    RecoveryCheckIn[] {
    const stored =
      localStorage.getItem(
        this.storageKey,
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
        ? (
            parsed as RecoveryCheckIn[]
          )
        : [];
    } catch {
      return [];
    }
  }


  private createId():
    string {
    if (
      typeof crypto !==
        'undefined' &&
      typeof crypto.randomUUID ===
        'function'
    ) {
      return crypto.randomUUID();
    }

    return [
      Date.now(),
      Math.random()
        .toString(36)
        .slice(2),
    ].join('-');
  }


  private getToday():
    string {
    const now =
      new Date();

    const year =
      now.getFullYear();

    const month =
      String(
        now.getMonth() + 1,
      ).padStart(
        2,
        '0',
      );

    const day =
      String(
        now.getDate(),
      ).padStart(
        2,
        '0',
      );

    return `${year}-${month}-${day}`;
  }
}