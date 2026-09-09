import {
  Component,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

interface SleepSession {
  id?: string;
  type?: 'sleep';
  babyName?: string;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  notes?: string;
  createdAt?: string;
}

interface SleepGroup {
  key: string;
  label: string;
  sessions: SleepSession[];
}

@Component({
  selector:
    'app-sleep-history',
  standalone: true,
  templateUrl:
    './sleep-history.component.html',
  styleUrl:
    './sleep-history.component.scss',
})
export class SleepHistoryComponent {
  private router =
    inject(Router);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  sessions:
    SleepSession[] = [];


  constructor() {
    this.loadSessions();
  }


  get totalSleeps(): number {
    return this.sessions.length;
  }


  get totalSleepText(): string {
    const seconds =
      this.sessions.reduce(
        (
          total,
          session,
        ) =>
          total +
          Math.max(
            0,
            session
              .durationSeconds ??
              0,
          ),
        0,
      );

    return this.formatDuration(
      seconds,
    );
  }


  get groupedSessions():
    SleepGroup[] {
    const groups =
      new Map<
        string,
        SleepGroup
      >();

    for (
      const session
      of this.sessions
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


  goBack(): void {
    void this.router.navigate(
      ['/sleep'],
    );
  }


  logSleep(): void {
    void this.router.navigate(
      ['/sleep'],
    );
  }


  getStartTime(
    session:
      SleepSession,
  ): string {
    return this.formatTime(
      session.startedAt,
    );
  }


  getEndTime(
    session:
      SleepSession,
  ): string {
    return this.formatTime(
      session.endedAt,
    );
  }


  getDuration(
    session:
      SleepSession,
  ): string {
    return this.formatDuration(
      Math.max(
        0,
        session
          .durationSeconds ??
          0,
      ),
    );
  }


  hasNotes(
    session:
      SleepSession,
  ): boolean {
    return Boolean(
      session.notes
        ?.trim(),
    );
  }


  getNotes(
    session:
      SleepSession,
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
      SleepSession,
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
        'mumma-bear:sleep-sessions',
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
                SleepSession,
              b:
                SleepSession,
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
      SleepSession,
  ): Date | null {
    const value =
      session.startedAt ||
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
      SleepSession,
  ): number {
    return (
      this.getSessionDate(
        session,
      )?.getTime() ??
      0
    );
  }


  private formatTime(
    value:
      string | undefined,
  ): string {
    if (!value) {
      return '--';
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
      return '--';
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


  private formatDuration(
    seconds: number,
  ): string {
    const totalMinutes =
      Math.max(
        0,
        Math.floor(
          seconds / 60,
        ),
      );

    const hours =
      Math.floor(
        totalMinutes /
          60,
      );

    const minutes =
      totalMinutes %
      60;

    if (
      hours === 0
    ) {
      if (
        totalMinutes === 0
      ) {
        return '< 1 min';
      }

      return `${totalMinutes} min`;
    }

    if (
      minutes === 0
    ) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
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

    const compare =
      new Date(
        date,
      );

    today.setHours(
      0,
      0,
      0,
      0,
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
          86_400_000,
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