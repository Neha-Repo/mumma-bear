import {
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type DiaperType =
  | 'wet'
  | 'dirty'
  | 'both';

type StoolConsistency =
  | 'seedy'
  | 'soft'
  | 'loose'
  | 'firm'
  | null;

interface DiaperSession {
  id: string;
  type: DiaperType;
  babyName: string;
  changedAt: string;
  stoolConsistency:
    StoolConsistency;
  notes: string;
  createdAt: string;
}

@Component({
  selector: 'app-diaper',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl:
    './diaper.component.html',
  styleUrl:
    './diaper.component.scss',
})
export class DiaperComponent {
  private router =
    inject(Router);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  selectedType:
    DiaperType = 'wet';

  stoolConsistency:
    StoolConsistency = null;

  changedAt =
    new Date();

  notes = '';

  isSaved = false;


  get showStoolDetails():
    boolean {
    return (
      this.selectedType ===
        'dirty' ||
      this.selectedType ===
        'both'
    );
  }


  get dateText(): string {
    const today =
      new Date();

    const selected =
      new Date(
        this.changedAt,
      );

    today.setHours(
      0,
      0,
      0,
      0,
    );

    selected.setHours(
      0,
      0,
      0,
      0,
    );

    if (
      today.getTime() ===
      selected.getTime()
    ) {
      return 'Today';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric',
      },
    ).format(
      this.changedAt,
    );
  }


  get timeText(): string {
    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
      },
    ).format(
      this.changedAt,
    );
  }


  selectType(
    type: DiaperType,
  ): void {
    this.selectedType =
      type;

    if (
      type === 'wet'
    ) {
      this.stoolConsistency =
        null;
    }
  }


  selectConsistency(
    consistency:
      Exclude<
        StoolConsistency,
        null
      >,
  ): void {
    if (
      this.stoolConsistency ===
      consistency
    ) {
      this.stoolConsistency =
        null;

      return;
    }

    this.stoolConsistency =
      consistency;
  }


  setNow(): void {
    this.changedAt =
      new Date();
  }


  saveDiaper(): void {
    if (this.isSaved) {
      return;
    }

    const session:
      DiaperSession = {
        id:
          this.createId(),

        type:
          this.selectedType,

        babyName:
          this.babyName,

        changedAt:
          this.changedAt
            .toISOString(),

        stoolConsistency:
          this.showStoolDetails
            ? this.stoolConsistency
            : null,

        notes:
          this.notes.trim(),

        createdAt:
          new Date()
            .toISOString(),
      };

    const sessions =
      this.loadSessions();

    sessions.unshift(
      session,
    );

    localStorage.setItem(
      'mumma-bear:diaper-sessions',
      JSON.stringify(
        sessions,
      ),
    );

    localStorage.setItem(
      'mumma-bear:last-diaper',
      JSON.stringify(
        session,
      ),
    );

    this.isSaved =
      true;

    setTimeout(
      () => {
        void this.router.navigate(
          ['/today'],
        );
      },
      400,
    );
  }


  goBack(): void {
    void this.router.navigate(
      ['/today'],
    );
  }


  viewHistory(): void {
    void this.router.navigate(
      ['/diaper/history'],
    );
  }


  private loadSessions():
    DiaperSession[] {
    const stored =
      localStorage.getItem(
        'mumma-bear:diaper-sessions',
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


  private createId(): string {
    if (
      typeof crypto !==
        'undefined' &&
      'randomUUID' in crypto
    ) {
      return crypto.randomUUID();
    }

    return `diaper-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }
}