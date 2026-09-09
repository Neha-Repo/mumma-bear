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

type BleedingLevel =
  | ''
  | 'none'
  | 'light'
  | 'moderate'
  | 'heavy';

interface RecoveryCheckIn {
  id: string;
  date: string;
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

  discomfortLevel:
    number | null =
      null;

  energyLevel:
    number | null =
      null;

  bleeding:
    BleedingLevel =
      '';

  recoveryNotes =
    '';

  medicationNotes =
    '';

  notes =
    '';

  showDeleteConfirmation =
    false;

  showValidation =
    false;


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


  save(): void {
    this.showValidation =
      true;

    if (
      !this.isValid()
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
          id:
            existing.id,
          date:
            this.date,
          discomfortLevel:
            this.normaliseLevel(
              this.discomfortLevel,
            ),
          energyLevel:
            this.normaliseLevel(
              this.energyLevel,
            ),
          bleeding:
            this.bleeding,
          recoveryNotes:
            this.recoveryNotes
              .trim(),
          medicationNotes:
            this.medicationNotes
              .trim(),
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
        discomfortLevel:
          this.normaliseLevel(
            this.discomfortLevel,
          ),
        energyLevel:
          this.normaliseLevel(
            this.energyLevel,
          ),
        bleeding:
          this.bleeding,
        recoveryNotes:
          this.recoveryNotes
            .trim(),
        medicationNotes:
          this.medicationNotes
            .trim(),
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


  private isValid():
    boolean {
    if (!this.date) {
      return false;
    }

    if (
      !this.isLevelValid(
        this.discomfortLevel,
      )
    ) {
      return false;
    }

    if (
      !this.isLevelValid(
        this.energyLevel,
      )
    ) {
      return false;
    }

    return this.hasAnyRecord();
  }


  hasAnyRecord():
    boolean {
    return (
      this.discomfortLevel !==
        null ||
      this.energyLevel !==
        null ||
      Boolean(
        this.bleeding,
      ) ||
      Boolean(
        this.recoveryNotes
          .trim(),
      ) ||
      Boolean(
        this.medicationNotes
          .trim(),
      ) ||
      Boolean(
        this.notes.trim(),
      )
    );
  }


  private isLevelValid(
    value:
      number | null,
  ): boolean {
    if (
      value === null ||
      value === undefined
    ) {
      return true;
    }

    return (
      Number.isFinite(
        Number(value),
      ) &&
      Number(value) >= 0 &&
      Number(value) <= 10
    );
  }


  private normaliseLevel(
    value:
      number | null,
  ): number | null {
    if (
      value === null ||
      value === undefined ||
      value === ('' as unknown)
    ) {
      return null;
    }

    const numeric =
      Number(value);

    if (
      !Number.isFinite(
        numeric,
      )
    ) {
      return null;
    }

    return numeric;
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

    this.date =
      entry.date;

    this.discomfortLevel =
      entry.discomfortLevel;

    this.energyLevel =
      entry.energyLevel;

    this.bleeding =
      entry.bleeding || '';

    this.recoveryNotes =
      entry.recoveryNotes || '';

    this.medicationNotes =
      entry.medicationNotes || '';

    this.notes =
      entry.notes || '';
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