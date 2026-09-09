import {
  Component,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

type DiaperType =
  | 'wet'
  | 'dirty'
  | 'both';

type DiaperFilter =
  | 'all'
  | DiaperType;

type StoolConsistency =
  | 'seedy'
  | 'soft'
  | 'loose'
  | 'firm'
  | null;

interface DiaperSession {
  id?: string;
  type?: DiaperType;
  babyName?: string;
  changedAt?: string;
  stoolConsistency?:
    StoolConsistency;
  notes?: string;
  createdAt?: string;
}

interface DiaperGroup {
  key: string;
  label: string;
  sessions:
    DiaperSession[];
}

@Component({
  selector:
    'app-diaper-history',
  standalone: true,
  templateUrl:
    './diaper-history.component.html',
  styleUrl:
    './diaper-history.component.scss',
})
export class DiaperHistoryComponent {
  private router =
    inject(Router);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  sessions:
    DiaperSession[] = [];

  selectedFilter:
    DiaperFilter = 'all';


  constructor() {
    this.loadSessions();
  }


  get filteredSessions():
    DiaperSession[] {
    if (
      this.selectedFilter ===
      'all'
    ) {
      return this.sessions;
    }

    return this.sessions.filter(
      (session) =>
        session.type ===
        this.selectedFilter,
    );
  }


  get groupedSessions():
    DiaperGroup[] {
    const groups =
      new Map<
        string,
        DiaperGroup
      >();

    for (
      const session
      of this.filteredSessions
    ) {
      const date =
        this.getSessionDate(
          session,
        );

      if (!date) {
        continue;
      }

      const key =
        this.dateKey(
          date,
        );

      if (
        !groups.has(key)
      ) {
        groups.set(
          key,
          {
            key,
            label:
              this.dateLabel(
                date,
              ),
            sessions: [],
          },
        );
      }

      groups
        .get(key)
        ?.sessions.push(
          session,
        );
    }

    return Array.from(
      groups.values(),
    );
  }


  get totalDiapers():
    number {
    return this.sessions.length;
  }


  setFilter(
    filter: DiaperFilter,
  ): void {
    this.selectedFilter =
      filter;
  }


  goBack(): void {
    void this.router.navigate(
      ['/diaper'],
    );
  }


  logDiaper(): void {
    void this.router.navigate(
      ['/diaper'],
    );
  }


  getTypeLabel(
    session:
      DiaperSession,
  ): string {
    switch (
      session.type
    ) {
      case 'wet':
        return 'Wet';

      case 'dirty':
        return 'Dirty';

      case 'both':
        return 'Wet + Dirty';

      default:
        return 'Diaper';
    }
  }


  getTypeSymbol(
    session:
      DiaperSession,
  ): string {
    switch (
      session.type
    ) {
      case 'wet':
        return 'W';

      case 'dirty':
        return 'D';

      case 'both':
        return 'B';

      default:
        return 'D';
    }
  }


  getTimeText(
    session:
      DiaperSession,
  ): string {
    const date =
      this.getSessionDate(
        session,
      );

    if (!date) {
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


  getConsistencyText(
    session:
      DiaperSession,
  ): string {
    if (
      !session
        .stoolConsistency
    ) {
      return '';
    }

    const value =
      session
        .stoolConsistency;

    return (
      value
        .charAt(0)
        .toUpperCase() +
      value.slice(1)
    );
  }


  hasNotes(
    session:
      DiaperSession,
  ): boolean {
    return Boolean(
      session.notes
        ?.trim(),
    );
  }


  getNotes(
    session:
      DiaperSession,
  ): string {
    return (
      session.notes
        ?.trim() ||
      ''
    );
  }


  trackSession(
    index: number,
    session:
      DiaperSession,
  ): string {
    return (
      session.id ||
      `${
        this.getTimestamp(
          session,
        )
      }-${index}`
    );
  }


  private loadSessions():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:diaper-sessions',
      );

    if (!stored) {
      this.sessions =
        [];

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
        this.sessions =
          [];

        return;
      }

      this.sessions =
        parsed
          .filter(
            (
              session,
            ) =>
              session &&
              typeof session ===
                'object',
          )
          .sort(
            (
              a:
                DiaperSession,
              b:
                DiaperSession,
            ) =>
              this.getTimestamp(
                b,
              ) -
              this.getTimestamp(
                a,
              ),
          );
    } catch {
      this.sessions =
        [];
    }
  }


  private getSessionDate(
    session:
      DiaperSession,
  ): Date | null {
    const value =
      session.changedAt ||
      session.createdAt;

    if (!value) {
      return null;
    }

    const date =
      new Date(
        value,
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


  private getTimestamp(
    session:
      DiaperSession,
  ): number {
    return (
      this
        .getSessionDate(
          session,
        )
        ?.getTime() ??
      0
    );
  }


  private dateKey(
    date: Date,
  ): string {
    const year =
      date.getFullYear();

    const month =
      (
        date.getMonth() +
        1
      )
        .toString()
        .padStart(
          2,
          '0',
        );

    const day =
      date
        .getDate()
        .toString()
        .padStart(
          2,
          '0',
        );

    return `${year}-${month}-${day}`;
  }


  private dateLabel(
    date: Date,
  ): string {
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

    const difference =
      Math.round(
        (
          today.getTime() -
          compare.getTime()
        ) /
          86400000,
      );

    if (
      difference === 0
    ) {
      return 'Today';
    }

    if (
      difference === 1
    ) {
      return 'Yesterday';
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
}