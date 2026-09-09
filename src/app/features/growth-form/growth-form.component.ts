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

interface GrowthEntry {
  id: string;
  date: string;
  weightKg:
    number | null;
  lengthCm:
    number | null;
  headCm:
    number | null;
  notes: string;
  createdAt: string;
}

@Component({
  selector: 'app-growth-form',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl:
    './growth-form.component.html',
  styleUrl:
    './growth-form.component.scss',
})
export class GrowthFormComponent
  implements OnInit
{
  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  entryId:
    string | null =
      null;

  isEditing =
    false;

  showDeleteConfirmation =
    false;

  date =
    this.todayDateValue();

  weight:
    number | null =
      null;

  length:
    number | null =
      null;

  head:
    number | null =
      null;

  notes =
    '';

  validationMessage =
    '';


  ngOnInit(): void {
    this.entryId =
      this.route.snapshot
        .paramMap
        .get('id');

    if (
      this.entryId
    ) {
      this.isEditing =
        true;

      this.loadEntry(
        this.entryId,
      );
    }
  }


  goBack(): void {
    void this.router.navigate(
      ['/baby/growth'],
    );
  }


  save(): void {
    this.validationMessage =
      '';

    const weight =
      this.normaliseMeasurement(
        this.weight,
      );

    const length =
      this.normaliseMeasurement(
        this.length,
      );

    const head =
      this.normaliseMeasurement(
        this.head,
      );

    if (!this.date) {
      this.validationMessage =
        'Please choose a measurement date.';

      return;
    }

    if (
      weight === null &&
      length === null &&
      head === null
    ) {
      this.validationMessage =
        'Enter at least one measurement.';

      return;
    }

    if (
      weight !== null &&
      weight <= 0
    ) {
      this.validationMessage =
        'Weight must be greater than zero.';

      return;
    }

    if (
      length !== null &&
      length <= 0
    ) {
      this.validationMessage =
        'Length must be greater than zero.';

      return;
    }

    if (
      head !== null &&
      head <= 0
    ) {
      this.validationMessage =
        'Head circumference must be greater than zero.';

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
        entries[
          existingIndex
        ] = {
          ...entries[
            existingIndex
          ],

          date:
            this.date,

          weightKg:
            weight,

          lengthCm:
            length,

          headCm:
            head,

          notes:
            this.notes.trim(),
        };
      }
    } else {
      const entry:
        GrowthEntry = {
          id:
            this.createId(),

          date:
            this.date,

          weightKg:
            weight,

          lengthCm:
            length,

          headCm:
            head,

          notes:
            this.notes.trim(),

          createdAt:
            new Date()
              .toISOString(),
        };

      entries.push(
        entry,
      );
    }

    localStorage.setItem(
      'mumma-bear:growth-entries',
      JSON.stringify(
        entries,
      ),
    );

    void this.router.navigate(
      ['/baby/growth'],
    );
  }


  requestDelete(): void {
    if (
      !this.isEditing ||
      !this.entryId
    ) {
      return;
    }

    this.showDeleteConfirmation =
      true;
  }


  cancelDelete(): void {
    this.showDeleteConfirmation =
      false;
  }


  confirmDelete(): void {
    if (
      !this.isEditing ||
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
      'mumma-bear:growth-entries',
      JSON.stringify(
        entries,
      ),
    );

    this.showDeleteConfirmation =
      false;

    void this.router.navigate(
      ['/baby/growth'],
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
        ['/baby/growth'],
      );

      return;
    }

    this.date =
      entry.date;

    this.weight =
      entry.weightKg;

    this.length =
      entry.lengthCm;

    this.head =
      entry.headCm;

    this.notes =
      entry.notes || '';
  }


  private loadEntries():
    GrowthEntry[] {
    const stored =
      localStorage.getItem(
        'mumma-bear:growth-entries',
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


  private normaliseMeasurement(
    value:
      number | null,
  ): number | null {
    if (
      value === null ||
      value === undefined
    ) {
      return null;
    }

    const parsed =
      Number(
        value,
      );

    if (
      Number.isNaN(
        parsed,
      )
    ) {
      return null;
    }

    return parsed;
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


  private createId():
    string {
    if (
      typeof crypto !==
        'undefined' &&
      'randomUUID' in crypto
    ) {
      return crypto.randomUUID();
    }

    return `growth-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }
}