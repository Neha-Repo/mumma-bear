import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type BreastSide =
  | 'left'
  | 'right'
  | 'both';

interface BreastfeedSession {
  id: string;
  type: 'breastfeed';
  babyName: string;
  side: BreastSide;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  notes: string;
  createdAt: string;
}

interface ActiveBreastfeedState {
  selectedSide: BreastSide;
  startedAt: string | null;
  accumulatedSeconds: number;
  runStartedAt: string | null;
  isRunning: boolean;
  isStopped: boolean;
  endedAt: string | null;
  notes: string;
}

@Component({
  selector: 'app-breastfeed',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl:
    './breastfeed.component.html',
  styleUrl:
    './breastfeed.component.scss',
})
export class BreastfeedComponent
  implements OnInit, OnDestroy
{
  private router =
    inject(Router);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  selectedSide:
    BreastSide = 'left';

  notes = '';

  startedAt:
    Date | null = null;

  endedAt:
    Date | null = null;

  runStartedAt:
    number | null = null;

  accumulatedSeconds = 0;

  isRunning = false;
  isStopped = false;
  isSaved = false;

  private now =
    signal(Date.now());

  private timerId:
    | ReturnType<typeof setInterval>
    | null = null;


  ngOnInit(): void {
    this.restoreActiveSession();

    this.now.set(
      Date.now(),
    );

    this.timerId =
      setInterval(
        () => {
          this.now.set(
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
  }


  get elapsedSeconds():
    number {
    if (
      !this.isRunning ||
      this.runStartedAt === null
    ) {
      return this
        .accumulatedSeconds;
    }

    const liveSeconds =
      Math.floor(
        (
          this.now() -
          this.runStartedAt
        ) /
          1000,
      );

    return (
      this.accumulatedSeconds +
      Math.max(
        0,
        liveSeconds,
      )
    );
  }


  get timerText(): string {
    const total =
      this.elapsedSeconds;

    const hours =
      Math.floor(
        total / 3600,
      );

    const minutes =
      Math.floor(
        (
          total % 3600
        ) /
          60,
      );

    const seconds =
      total % 60;

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
      return '--:--';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
      },
    ).format(
      this.startedAt,
    );
  }


  get startedDateText():
    string {
    if (!this.startedAt) {
      return 'Not started';
    }

    const today =
      new Date();

    const started =
      new Date(
        this.startedAt,
      );

    today.setHours(
      0,
      0,
      0,
      0,
    );

    started.setHours(
      0,
      0,
      0,
      0,
    );

    if (
      today.getTime() ===
      started.getTime()
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
      started,
    );
  }


  get canSave(): boolean {
    return (
      this.startedAt !== null &&
      this.isStopped &&
      this.elapsedSeconds > 0 &&
      !this.isSaved
    );
  }


  selectSide(
    side: BreastSide,
  ): void {
    if (
      this.isStopped ||
      this.isSaved
    ) {
      return;
    }

    this.selectedSide =
      side;

    if (
      this.startedAt
    ) {
      this.persistActiveSession();
    }
  }


  startTimer(): void {
    if (
      this.isStopped ||
      this.isSaved ||
      this.isRunning
    ) {
      return;
    }

    if (!this.startedAt) {
      this.startedAt =
        new Date();

      this.accumulatedSeconds =
        0;

      this.endedAt =
        null;
    }

    this.runStartedAt =
      Date.now();

    this.now.set(
      Date.now(),
    );

    this.isRunning =
      true;

    this.isStopped =
      false;

    this.persistActiveSession();
  }


  pauseTimer(): void {
    if (!this.isRunning) {
      return;
    }

    this.commitLiveTime();

    this.isRunning =
      false;

    this.runStartedAt =
      null;

    this.persistActiveSession();
  }


  resumeTimer(): void {
    if (
      this.isRunning ||
      !this.startedAt ||
      this.isStopped ||
      this.isSaved
    ) {
      return;
    }

    this.runStartedAt =
      Date.now();

    this.now.set(
      Date.now(),
    );

    this.isRunning =
      true;

    this.persistActiveSession();
  }


  stopTimer(): void {
    if (
      !this.startedAt ||
      this.isStopped ||
      this.isSaved
    ) {
      return;
    }

    if (this.isRunning) {
      this.commitLiveTime();
    }

    this.isRunning =
      false;

    this.runStartedAt =
      null;

    this.endedAt =
      new Date();

    this.isStopped =
      true;

    this.now.set(
      Date.now(),
    );

    this.persistActiveSession();
  }


  startNewSession(): void {
    localStorage.removeItem(
      'mumma-bear:active-breastfeed',
    );

    this.selectedSide =
      'left';

    this.notes = '';

    this.startedAt =
      null;

    this.endedAt =
      null;

    this.runStartedAt =
      null;

    this.accumulatedSeconds =
      0;

    this.isRunning =
      false;

    this.isStopped =
      false;

    this.isSaved =
      false;

    this.now.set(
      Date.now(),
    );
  }


  saveFeed(): void {
    if (
      !this.canSave ||
      !this.startedAt ||
      !this.endedAt
    ) {
      return;
    }

    const session:
      BreastfeedSession = {
        id:
          this.createId(),

        type:
          'breastfeed',

        babyName:
          this.babyName,

        side:
          this.selectedSide,

        startedAt:
          this.startedAt
            .toISOString(),

        endedAt:
          this.endedAt
            .toISOString(),

        durationSeconds:
          this.elapsedSeconds,

        notes:
          this.notes.trim(),

        createdAt:
          new Date()
            .toISOString(),
      };

    const sessions =
      this.loadExistingSessions();

    sessions.unshift(
      session,
    );

    localStorage.setItem(
      'mumma-bear:feeding-sessions',
      JSON.stringify(
        sessions,
      ),
    );

    localStorage.setItem(
      'mumma-bear:last-feed',
      JSON.stringify(
        session,
      ),
    );

    localStorage.removeItem(
      'mumma-bear:active-breastfeed',
    );

    this.isSaved =
      true;

    setTimeout(
      () => {
        void this.router.navigate(
          ['/feed'],
        );
      },
      400,
    );
  }


  goBack(): void {
    if (
      this.startedAt &&
      !this.isSaved
    ) {
      this.persistActiveSession();
    }

    void this.router.navigate(
      ['/feed'],
    );
  }


  private commitLiveTime():
    void {
    if (
      this.runStartedAt === null
    ) {
      return;
    }

    const currentTime =
      Date.now();

    const seconds =
      Math.floor(
        (
          currentTime -
          this.runStartedAt
        ) /
          1000,
      );

    this.accumulatedSeconds +=
      Math.max(
        0,
        seconds,
      );

    this.now.set(
      currentTime,
    );
  }


  private persistActiveSession():
    void {
    if (!this.startedAt) {
      return;
    }

    const state:
      ActiveBreastfeedState = {
        selectedSide:
          this.selectedSide,

        startedAt:
          this.startedAt
            .toISOString(),

        accumulatedSeconds:
          this.accumulatedSeconds,

        runStartedAt:
          this.isRunning &&
          this.runStartedAt !== null
            ? new Date(
                this.runStartedAt,
              ).toISOString()
            : null,

        isRunning:
          this.isRunning,

        isStopped:
          this.isStopped,

        endedAt:
          this.endedAt
            ? this.endedAt
                .toISOString()
            : null,

        notes:
          this.notes,
      };

    localStorage.setItem(
      'mumma-bear:active-breastfeed',
      JSON.stringify(
        state,
      ),
    );
  }


  private restoreActiveSession():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:active-breastfeed',
      );

    if (!stored) {
      return;
    }

    try {
      const state =
        JSON.parse(
          stored,
        ) as ActiveBreastfeedState;

      if (
        !state ||
        !state.startedAt
      ) {
        localStorage.removeItem(
          'mumma-bear:active-breastfeed',
        );

        return;
      }

      const restoredStartedAt =
        new Date(
          state.startedAt,
        );

      if (
        Number.isNaN(
          restoredStartedAt.getTime(),
        )
      ) {
        localStorage.removeItem(
          'mumma-bear:active-breastfeed',
        );

        return;
      }

      this.selectedSide =
        state.selectedSide ||
        'left';

      this.startedAt =
        restoredStartedAt;

      this.accumulatedSeconds =
        Number.isFinite(
          state.accumulatedSeconds,
        )
          ? Math.max(
              0,
              state.accumulatedSeconds,
            )
          : 0;

      this.notes =
        state.notes || '';

      this.isStopped =
        Boolean(
          state.isStopped,
        );

      this.endedAt =
        state.endedAt
          ? new Date(
              state.endedAt,
            )
          : null;

      if (
        state.isRunning &&
        state.runStartedAt &&
        !state.isStopped
      ) {
        const previousRunStart =
          new Date(
            state.runStartedAt,
          ).getTime();

        if (
          !Number.isNaN(
            previousRunStart,
          )
        ) {
          const elapsedWhileAway =
            Math.floor(
              (
                Date.now() -
                previousRunStart
              ) /
                1000,
            );

          this.accumulatedSeconds +=
            Math.max(
              0,
              elapsedWhileAway,
            );
        }

        this.runStartedAt =
          Date.now();

        this.isRunning =
          true;

        this.isStopped =
          false;

        this.now.set(
          Date.now(),
        );

        this.persistActiveSession();

        return;
      }

      this.runStartedAt =
        null;

      this.isRunning =
        false;

      this.now.set(
        Date.now(),
      );
    } catch {
      localStorage.removeItem(
        'mumma-bear:active-breastfeed',
      );

      this.startNewSession();
    }
  }


  private loadExistingSessions():
    BreastfeedSession[] {
    const stored =
      localStorage.getItem(
        'mumma-bear:feeding-sessions',
      );

    if (!stored) {
      return [];
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        );

      if (
        Array.isArray(
          parsed,
        )
      ) {
        return parsed;
      }

      return [];
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

    return `feed-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }
}