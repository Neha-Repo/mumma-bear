import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type SleepStatus =
  | 'ready'
  | 'running'
  | 'paused'
  | 'stopped';

interface ActiveSleepSession {
  status: SleepStatus;
  startedAt: string | null;
  runningSince: string | null;
  accumulatedMs: number;
  endedAt: string | null;
  notes: string;
}

interface SleepSession {
  id: string;
  type: 'sleep';
  babyName: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  notes: string;
  createdAt: string;
}

@Component({
  selector: 'app-sleep',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl:
    './sleep.component.html',
  styleUrl:
    './sleep.component.scss',
})
export class SleepComponent
  implements OnInit, OnDestroy
{
  private router =
    inject(Router);

  private readonly activeKey =
    'mumma-bear:active-sleep';

  private timerId:
    | ReturnType<typeof setInterval>
    | null = null;

  private currentTime =
    signal(Date.now());

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  status:
    SleepStatus = 'ready';

  startedAt:
    string | null = null;

  runningSince:
    string | null = null;

  accumulatedMs = 0;

  endedAt:
    string | null = null;

  notes = '';

  isSaved = false;


  ngOnInit(): void {
    this.restoreActiveSession();

    this.timerId =
      setInterval(
        () => {
          this.currentTime.set(
            Date.now(),
          );
        },
        250,
      );
  }


  ngOnDestroy(): void {
    if (
      this.timerId !== null
    ) {
      clearInterval(
        this.timerId,
      );
    }

    this.persistActiveSession();
  }


  get elapsedMilliseconds():
    number {
    this.currentTime();

    let total =
      this.accumulatedMs;

    if (
      this.status ===
        'running' &&
      this.runningSince
    ) {
      const runningStart =
        new Date(
          this.runningSince,
        ).getTime();

      if (
        !Number.isNaN(
          runningStart,
        )
      ) {
        total +=
          Date.now() -
          runningStart;
      }
    }

    return Math.max(
      0,
      total,
    );
  }


  get timerText(): string {
    const totalSeconds =
      Math.floor(
        this.elapsedMilliseconds /
          1000,
      );

    const hours =
      Math.floor(
        totalSeconds /
          3600,
      );

    const minutes =
      Math.floor(
        (
          totalSeconds %
          3600
        ) /
          60,
      );

    const seconds =
      totalSeconds %
      60;

    return [
      hours,
      minutes,
      seconds,
    ]
      .map(
        (value) =>
          value
            .toString()
            .padStart(
              2,
              '0',
            ),
      )
      .join(':');
  }


  get startedTimeText():
    string {
    if (!this.startedAt) {
      return '--';
    }

    const date =
      new Date(
        this.startedAt,
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


  get startedDateText():
    string {
    if (!this.startedAt) {
      return 'Today';
    }

    const date =
      new Date(
        this.startedAt,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return 'Today';
    }

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

    if (
      today.getTime() ===
      compare.getTime()
    ) {
      return 'Today';
    }

    const yesterday =
      new Date(
        today,
      );

    yesterday.setDate(
      yesterday.getDate() -
        1,
    );

    if (
      yesterday.getTime() ===
      compare.getTime()
    ) {
      return 'Yesterday';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric',
      },
    ).format(
      date,
    );
  }


  get isReady(): boolean {
    return (
      this.status ===
      'ready'
    );
  }


  get isRunning(): boolean {
    return (
      this.status ===
      'running'
    );
  }


  get isPaused(): boolean {
    return (
      this.status ===
      'paused'
    );
  }


  get isStopped(): boolean {
    return (
      this.status ===
      'stopped'
    );
  }


  startSleep(): void {
    if (
      this.status !==
      'ready'
    ) {
      return;
    }

    const now =
      new Date();

    this.startedAt =
      now.toISOString();

    this.runningSince =
      now.toISOString();

    this.accumulatedMs =
      0;

    this.endedAt =
      null;

    this.status =
      'running';

    this.isSaved =
      false;

    this.persistActiveSession();
  }


  pauseSleep(): void {
    if (
      this.status !==
        'running' ||
      !this.runningSince
    ) {
      return;
    }

    this.captureRunningTime();

    this.runningSince =
      null;

    this.status =
      'paused';

    this.persistActiveSession();
  }


  resumeSleep(): void {
    if (
      this.status !==
      'paused'
    ) {
      return;
    }

    this.runningSince =
      new Date()
        .toISOString();

    this.status =
      'running';

    this.persistActiveSession();
  }


  stopSleep(): void {
    if (
      this.status !==
        'running' &&
      this.status !==
        'paused'
    ) {
      return;
    }

    if (
      this.status ===
      'running'
    ) {
      this.captureRunningTime();
    }

    this.runningSince =
      null;

    this.endedAt =
      new Date()
        .toISOString();

    this.status =
      'stopped';

    this.persistActiveSession();
  }


  saveSleep(): void {
    if (
      this.status !==
        'stopped' ||
      !this.startedAt ||
      !this.endedAt ||
      this.isSaved
    ) {
      return;
    }

    const session:
      SleepSession = {
        id:
          this.createId(),

        type:
          'sleep',

        babyName:
          this.babyName,

        startedAt:
          this.startedAt,

        endedAt:
          this.endedAt,

        durationSeconds:
          Math.max(
            1,
            Math.round(
              this.accumulatedMs /
                1000,
            ),
          ),

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
      'mumma-bear:sleep-sessions',
      JSON.stringify(
        sessions,
      ),
    );

    localStorage.setItem(
      'mumma-bear:last-sleep',
      JSON.stringify(
        session,
      ),
    );

    localStorage.removeItem(
      this.activeKey,
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


  startNewSession(): void {
    localStorage.removeItem(
      this.activeKey,
    );

    this.status =
      'ready';

    this.startedAt =
      null;

    this.runningSince =
      null;

    this.accumulatedMs =
      0;

    this.endedAt =
      null;

    this.notes =
      '';

    this.isSaved =
      false;

    this.currentTime.set(
      Date.now(),
    );
  }


  goBack(): void {
    this.persistActiveSession();

    void this.router.navigate(
      ['/today'],
    );
  }


  viewHistory(): void {
    this.persistActiveSession();

    void this.router.navigate(
      ['/sleep/history'],
    );
  }


  private captureRunningTime():
    void {
    if (!this.runningSince) {
      return;
    }

    const started =
      new Date(
        this.runningSince,
      ).getTime();

    if (
      Number.isNaN(
        started,
      )
    ) {
      return;
    }

    this.accumulatedMs +=
      Math.max(
        0,
        Date.now() -
          started,
      );
  }


  private persistActiveSession():
    void {
    if (
      this.status ===
      'ready'
    ) {
      localStorage.removeItem(
        this.activeKey,
      );

      return;
    }

    const active:
      ActiveSleepSession = {
        status:
          this.status,

        startedAt:
          this.startedAt,

        runningSince:
          this.runningSince,

        accumulatedMs:
          this.accumulatedMs,

        endedAt:
          this.endedAt,

        notes:
          this.notes,
      };

    localStorage.setItem(
      this.activeKey,
      JSON.stringify(
        active,
      ),
    );
  }


  private restoreActiveSession():
    void {
    const stored =
      localStorage.getItem(
        this.activeKey,
      );

    if (!stored) {
      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        ) as ActiveSleepSession;

      if (
        !parsed ||
        !parsed.status
      ) {
        return;
      }

      this.status =
        parsed.status;

      this.startedAt =
        parsed.startedAt ??
        null;

      this.runningSince =
        parsed.runningSince ??
        null;

      this.accumulatedMs =
        Number.isFinite(
          parsed.accumulatedMs,
        )
          ? parsed.accumulatedMs
          : 0;

      this.endedAt =
        parsed.endedAt ??
        null;

      this.notes =
        parsed.notes ??
        '';

      if (
        this.status ===
          'running' &&
        !this.runningSince
      ) {
        this.runningSince =
          new Date()
            .toISOString();
      }

      this.currentTime.set(
        Date.now(),
      );
    } catch {
      localStorage.removeItem(
        this.activeKey,
      );
    }
  }


  private loadSessions():
    SleepSession[] {
    const stored =
      localStorage.getItem(
        'mumma-bear:sleep-sessions',
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

    return `sleep-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }
}