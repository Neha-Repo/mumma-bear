import {
  Component,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

type FeedType =
  | 'breastfeed'
  | 'pumped-milk'
  | 'formula';

type FeedFilter =
  | 'all'
  | FeedType;

interface FeedingSession {
  id?: string;
  type?: FeedType;
  babyName?: string;

  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  side?: string;

  fedAt?: string;
  amountMl?: number;
  amountOz?: number;

  formulaName?: string;
  notes?: string;

  createdAt?: string;
}

interface FeedingGroup {
  key: string;
  label: string;
  sessions: FeedingSession[];
}

@Component({
  selector: 'app-feeding-history',
  standalone: true,
  templateUrl:
    './feeding-history.component.html',
  styleUrl:
    './feeding-history.component.scss',
})
export class FeedingHistoryComponent {
  private router =
    inject(Router);

  sessions:
    FeedingSession[] = [];

  selectedFilter:
    FeedFilter = 'all';

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  constructor() {
    this.loadSessions();
  }


  get filteredSessions():
    FeedingSession[] {
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
    FeedingGroup[] {
    const groups =
      new Map<
        string,
        FeedingGroup
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


  get totalFeeds():
    number {
    return this.sessions.length;
  }


  setFilter(
    filter: FeedFilter,
  ): void {
    this.selectedFilter =
      filter;
  }


  goBack(): void {
    void this.router.navigate(
      ['/feed'],
    );
  }


  getTypeLabel(
    session:
      FeedingSession,
  ): string {
    switch (
      session.type
    ) {
      case 'breastfeed':
        return 'Breastfeed';

      case 'pumped-milk':
        return 'Pumped milk';

      case 'formula':
        return 'Formula';

      default:
        return 'Feed';
    }
  }


  getTypeSymbol(
    session:
      FeedingSession,
  ): string {
    switch (
      session.type
    ) {
      case 'breastfeed':
        return 'B';

      case 'pumped-milk':
        return 'M';

      case 'formula':
        return 'F';

      default:
        return '•';
    }
  }


  getTimeText(
    session:
      FeedingSession,
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


  getPrimaryDetail(
    session:
      FeedingSession,
  ): string {
    if (
      session.type ===
      'breastfeed'
    ) {
      const duration =
        this.formatDuration(
          session.durationSeconds ??
          0,
        );

      const side =
        this.sideLabel(
          session.side,
        );

      if (
        side &&
        duration
      ) {
        return `${side} · ${duration}`;
      }

      return (
        side ||
        duration ||
        'Breastfeed'
      );
    }

    if (
      session.type ===
        'formula' ||
      session.type ===
        'pumped-milk'
    ) {
      if (
        typeof session.amountMl ===
        'number'
      ) {
        return `${session.amountMl} ml`;
      }
    }

    return '';
  }


  getSecondaryDetail(
    session:
      FeedingSession,
  ): string {
    if (
      session.type ===
        'formula' &&
      session.formulaName
        ?.trim()
    ) {
      return session
        .formulaName
        .trim();
    }

    if (
      session.type ===
        'pumped-milk'
    ) {
      return 'Stored breast milk';
    }

    if (
      session.type ===
        'breastfeed'
    ) {
      return `Fed ${this.babyName}`;
    }

    return '';
  }


  hasNotes(
    session:
      FeedingSession,
  ): boolean {
    return Boolean(
      session.notes
        ?.trim(),
    );
  }


  getNotes(
    session:
      FeedingSession,
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
      FeedingSession,
  ): string {
    return (
      session.id ||
      `${
        this.getSessionTimestamp(
          session,
        )
      }-${index}`
    );
  }


  private loadSessions():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:feeding-sessions',
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
                FeedingSession,
              b:
                FeedingSession,
            ) =>
              this
                .getSessionTimestamp(
                  b,
                ) -
              this
                .getSessionTimestamp(
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
      FeedingSession,
  ): Date | null {
    const value =
      session.type ===
        'breastfeed'
        ? session.startedAt
        : session.fedAt;

    const fallback =
      session.createdAt;

    const source =
      value ||
      fallback;

    if (!source) {
      return null;
    }

    const date =
      new Date(
        source,
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


  private getSessionTimestamp(
    session:
      FeedingSession,
  ): number {
    const date =
      this.getSessionDate(
        session,
      );

    return (
      date?.getTime() ??
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


  private formatDuration(
    seconds: number,
  ): string {
    const safeSeconds =
      Math.max(
        0,
        Math.floor(
          seconds,
        ),
      );

    if (
      safeSeconds < 60
    ) {
      return `${safeSeconds} sec`;
    }

    const minutes =
      Math.floor(
        safeSeconds /
        60,
      );

    const remainder =
      safeSeconds %
      60;

    if (
      remainder === 0
    ) {
      return `${minutes} min`;
    }

    return `${minutes} min ${remainder} sec`;
  }


  private sideLabel(
    side:
      string |
      undefined,
  ): string {
    switch (side) {
      case 'left':
        return 'Left side';

      case 'right':
        return 'Right side';

      case 'both':
        return 'Both sides';

      default:
        return '';
    }
  }
}