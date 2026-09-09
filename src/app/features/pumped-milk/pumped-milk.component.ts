import {
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

type StorageLocation = 'room' | 'fridge' | 'freezer';

interface PumpSession {
  id: string;
  pumpedAt: string;
  amountMl: number | null;
  storageLocation: StorageLocation;
  notes: string;
  useBy: string;
  createdAt: string;
}

@Component({
  selector: 'app-pumped-milk',
  standalone: true,
  templateUrl: './pumped-milk.component.html',
  styleUrl: './pumped-milk.component.scss',
})
export class PumpedMilkComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);

  readonly tabs: {
    value: StorageLocation;
    label: string;
  }[] = [
    {
      value: 'room',
      label: 'Room',
    },
    {
      value: 'fridge',
      label: 'Fridge',
    },
    {
      value: 'freezer',
      label: 'Freezer',
    },
  ];

  selectedStorage: StorageLocation = 'fridge';

  sessions: PumpSession[] = [];

  visibleLimit = 10;

  private currentTimestamp = Date.now();

  private timerId:
    | ReturnType<typeof setInterval>
    | null = null;

  ngOnInit(): void {
    this.loadSessions();
    this.selectInitialStorage();

    this.timerId = setInterval(() => {
      this.currentTimestamp = Date.now();
    }, 30_000);
  }

  ngOnDestroy(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
  }

  get activeSessions(): PumpSession[] {
    return this.sessions
      .filter((session) => {
        if (
          session.storageLocation !==
          this.selectedStorage
        ) {
          return false;
        }

        const useBy = new Date(
          session.useBy,
        ).getTime();

        return (
          Number.isFinite(useBy) &&
          useBy >
            this.currentTimestamp
        );
      })
      .sort(
        (a, b) =>
          new Date(
            a.useBy,
          ).getTime() -
          new Date(
            b.useBy,
          ).getTime(),
      );
  }

  get visibleSessions(): PumpSession[] {
    return this.activeSessions.slice(
      0,
      this.visibleLimit,
    );
  }

  get hasMoreSessions(): boolean {
    return (
      this.activeSessions.length >
      this.visibleLimit
    );
  }

  get totalAmountMl(): number {
    return this.activeSessions.reduce(
      (total, session) =>
        total +
        (session.amountMl ?? 0),
      0,
    );
  }

  get sectionTitle(): string {
    switch (this.selectedStorage) {
      case 'room':
        return 'Milk at Room Temp';

      case 'fridge':
        return 'Milk in Fridge';

      case 'freezer':
        return 'Milk in Freezer';
    }
  }

  selectStorage(
    storage: StorageLocation,
  ): void {
    this.selectedStorage = storage;
    this.visibleLimit = 10;
  }

  showMore(): void {
    this.visibleLimit += 10;
  }

  getPumpTime(
    session: PumpSession,
  ): string {
    const date = new Date(
      session.pumpedAt,
    );

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
      },
    ).format(date);
  }

  getPumpDate(
    session: PumpSession,
  ): string {
    const date = new Date(
      session.pumpedAt,
    );

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const today = new Date();
    const yesterday = new Date();

    today.setHours(0, 0, 0, 0);

    yesterday.setHours(
      0,
      0,
      0,
      0,
    );

    yesterday.setDate(
      yesterday.getDate() - 1,
    );

    const compareDate =
      new Date(date);

    compareDate.setHours(
      0,
      0,
      0,
      0,
    );

    if (
      compareDate.getTime() ===
      today.getTime()
    ) {
      return 'Today';
    }

    if (
      compareDate.getTime() ===
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
    ).format(date);
  }

  getUseByText(
    session: PumpSession,
  ): string {
    const useBy = new Date(
      session.useBy,
    );

    if (Number.isNaN(useBy.getTime())) {
      return '';
    }

    const pumpedAt = new Date(
      session.pumpedAt,
    );

    const sameDay =
      pumpedAt.getFullYear() ===
        useBy.getFullYear() &&
      pumpedAt.getMonth() ===
        useBy.getMonth() &&
      pumpedAt.getDate() ===
        useBy.getDate();

    if (sameDay) {
      return new Intl.DateTimeFormat(
        undefined,
        {
          hour: 'numeric',
          minute: '2-digit',
        },
      ).format(useBy);
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
      },
    ).format(useBy);
  }

  getRemainingText(
    session: PumpSession,
  ): string {
    const useBy = new Date(
      session.useBy,
    ).getTime();

    if (!Number.isFinite(useBy)) {
      return '';
    }

    const difference =
      useBy -
      this.currentTimestamp;

    if (difference <= 0) {
      return 'Expired';
    }

    const totalMinutes = Math.floor(
      difference / 60_000,
    );

    if (totalMinutes < 60) {
      return `${totalMinutes}m left`;
    }

    const totalHours = Math.floor(
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

    const days = Math.floor(
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

    const months = Math.floor(
      days / 30,
    );

    const daysLeft =
      days % 30;

    if (daysLeft === 0) {
      return `${months}m left`;
    }

    return `${months}m ${daysLeft}d left`;
  }

  getProgress(
    session: PumpSession,
  ): number {
    const pumpedAt = new Date(
      session.pumpedAt,
    ).getTime();

    const useBy = new Date(
      session.useBy,
    ).getTime();

    if (
      !Number.isFinite(pumpedAt) ||
      !Number.isFinite(useBy)
    ) {
      return 0;
    }

    const totalDuration =
      useBy - pumpedAt;

    if (totalDuration <= 0) {
      return 0;
    }

    const remaining =
      useBy -
      this.currentTimestamp;

    const percentage =
      (remaining /
        totalDuration) *
      100;

    return Math.max(
      0,
      Math.min(
        100,
        percentage,
      ),
    );
  }

  goBack(): void {
    void this.router.navigate([
      '/pump',
    ]);
  }

  openHistory(): void {
    /*
     * History page will be connected
     * when we build milk history.
     */
  }

  openStorageGuidelines(): void {
    /*
     * Safe storage guidance page
     * will be connected later.
     */
  }

  private loadSessions(): void {
    const stored =
      localStorage.getItem(
        'mumma-bear:pump-sessions',
      );

    if (!stored) {
      this.sessions = [];
      return;
    }

    try {
      const parsed =
        JSON.parse(stored);

      this.sessions =
        Array.isArray(parsed)
          ? parsed
          : [];
    } catch {
      this.sessions = [];
    }
  }

  private selectInitialStorage(): void {
    const lastPumpRaw =
      localStorage.getItem(
        'mumma-bear:last-pump',
      );

    if (!lastPumpRaw) {
      return;
    }

    try {
      const lastPump =
        JSON.parse(
          lastPumpRaw,
        ) as PumpSession;

      if (
        lastPump.storageLocation ===
          'room' ||
        lastPump.storageLocation ===
          'fridge' ||
        lastPump.storageLocation ===
          'freezer'
      ) {
        this.selectedStorage =
          lastPump.storageLocation;
      }
    } catch {
      // Keep Fridge as the default.
    }
  }
}