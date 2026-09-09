import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type StorageLocation = 'room' | 'fridge' | 'freezer';
type Period = 'AM' | 'PM';

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
  selector: 'app-pump',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './pump.component.html',
  styleUrl: './pump.component.scss',
})
export class PumpComponent
  implements AfterViewInit, OnDestroy
{
  private readonly router =
    inject(Router);

  @ViewChild('hourWheel')
  private hourWheel?:
    ElementRef<HTMLDivElement>;

  @ViewChild('minuteWheel')
  private minuteWheel?:
    ElementRef<HTMLDivElement>;

  @ViewChild('periodWheel')
  private periodWheel?:
    ElementRef<HTMLDivElement>;

  readonly hours = [
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12,
  ];

  readonly minutes = [
    0, 5, 10, 15, 20, 25,
    30, 35, 40, 45, 50, 55,
  ];

  readonly periods: Period[] = [
    'AM',
    'PM',
  ];

  readonly storageOptions: {
    value: StorageLocation;
    label: string;
    guidance: string;
  }[] = [
    {
      value: 'room',
      label: 'Room Temp',
      guidance: 'Up to 4h',
    },
    {
      value: 'fridge',
      label: 'Fridge',
      guidance: 'Up to 4d',
    },
    {
      value: 'freezer',
      label: 'Freezer',
      guidance: 'Up to 6m',
    },
  ];

  selectedHour = 12;
  selectedMinute = 0;

  selectedPeriod: Period =
    'AM';

  selectedDate = '';

  selectedStorage:
    StorageLocation =
    'room';

  amountMl: number | null =
    120;

  notes = '';

  saved = false;

  private readonly wheelItemHeight =
    52;

  private currentTimestamp =
    Date.now();

  private timerId:
    | ReturnType<typeof setInterval>
    | null = null;

  constructor() {
    this.setCurrentTime();
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.positionAllWheels();
    });

    this.timerId =
      setInterval(() => {
        this.currentTimestamp =
          Date.now();
      }, 30_000);
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

  get formattedPumpTime(): string {
    return `${this.selectedHour}:${String(
      this.selectedMinute,
    ).padStart(
      2,
      '0',
    )} ${this.selectedPeriod}`;
  }

  get formattedPumpDate(): string {
    const selected =
      this.getSelectedDateOnly();

    if (!selected) {
      return '';
    }

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0,
    );

    const yesterday =
      new Date(today);

    yesterday.setDate(
      yesterday.getDate() - 1,
    );

    selected.setHours(
      0,
      0,
      0,
      0,
    );

    const dateText =
      new Intl.DateTimeFormat(
        undefined,
        {
          month: 'short',
          day: 'numeric',
        },
      ).format(selected);

    if (
      selected.getTime() ===
      today.getTime()
    ) {
      return `${dateText}, Today`;
    }

    if (
      selected.getTime() ===
      yesterday.getTime()
    ) {
      return `${dateText}, Yesterday`;
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric',
        year:
          selected.getFullYear() !==
          today.getFullYear()
            ? 'numeric'
            : undefined,
      },
    ).format(selected);
  }

  get formattedUseBy(): string {
    const useBy =
      this.calculateUseBy();

    if (!useBy) {
      return '';
    }

    const pumpDate =
      this.getSelectedDateTime();

    if (!pumpDate) {
      return '';
    }

    const sameDay =
      pumpDate.getFullYear() ===
        useBy.getFullYear() &&
      pumpDate.getMonth() ===
        useBy.getMonth() &&
      pumpDate.getDate() ===
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

    if (
      this.selectedStorage ===
      'freezer'
    ) {
      return new Intl.DateTimeFormat(
        undefined,
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
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

  get remainingTimeText(): string {
    const useBy =
      this.calculateUseBy();

    if (!useBy) {
      return '';
    }

    const difference =
      useBy.getTime() -
      this.currentTimestamp;

    if (difference <= 0) {
      return 'Use-by time reached';
    }

    const totalMinutes =
      Math.floor(
        difference / 60_000,
      );

    if (
      totalMinutes < 60
    ) {
      return `${totalMinutes}m remaining`;
    }

    const totalHours =
      Math.floor(
        totalMinutes / 60,
      );

    const minutes =
      totalMinutes % 60;

    if (
      totalHours < 24
    ) {
      if (
        minutes === 0
      ) {
        return `${totalHours}h remaining`;
      }

      return `${totalHours}h ${minutes}m remaining`;
    }

    const days =
      Math.floor(
        totalHours / 24,
      );

    const hours =
      totalHours % 24;

    if (days < 60) {
      if (hours === 0) {
        return `${days}d remaining`;
      }

      return `${days}d ${hours}h remaining`;
    }

    const months =
      Math.floor(
        days / 30,
      );

    const remainingDays =
      days % 30;

    if (
      remainingDays === 0
    ) {
      return `${months}m remaining`;
    }

    return `${months}m ${remainingDays}d remaining`;
  }

  setNow(): void {
    this.setCurrentTime();

    requestAnimationFrame(() => {
      this.positionAllWheels();
    });
  }

  onHourScroll(): void {
    const element =
      this.hourWheel
        ?.nativeElement;

    if (!element) {
      return;
    }

    const index =
      this.getWheelIndex(
        element,
        this.hours.length,
      );

    this.selectedHour =
      this.hours[index];

    this.saved = false;
  }

  onMinuteScroll(): void {
    const element =
      this.minuteWheel
        ?.nativeElement;

    if (!element) {
      return;
    }

    const index =
      this.getWheelIndex(
        element,
        this.minutes.length,
      );

    this.selectedMinute =
      this.minutes[index];

    this.saved = false;
  }

  onPeriodScroll(): void {
    const element =
      this.periodWheel
        ?.nativeElement;

    if (!element) {
      return;
    }

    const index =
      this.getWheelIndex(
        element,
        this.periods.length,
      );

    this.selectedPeriod =
      this.periods[index];

    this.saved = false;
  }

  selectStorage(
    storage:
      StorageLocation,
  ): void {
    this.selectedStorage =
      storage;

    this.saved = false;
  }

  decreaseAmount(): void {
    const current =
      this.amountMl ?? 0;

    if (current <= 10) {
      this.amountMl =
        null;

      return;
    }

    this.amountMl =
      current - 10;

    this.saved = false;
  }

  increaseAmount(): void {
    const current =
      this.amountMl ?? 0;

    if (current >= 350) {
      return;
    }

    this.amountMl =
      current + 10;

    this.saved = false;
  }

  savePump(): void {
    const pumpedAt =
      this.getSelectedDateTime();

    if (!pumpedAt) {
      return;
    }

    const useBy =
      this.calculateUseBy();

    if (!useBy) {
      return;
    }

    const session:
      PumpSession = {
      id: this.createId(),

      pumpedAt:
        pumpedAt.toISOString(),

      amountMl:
        this.amountMl,

      storageLocation:
        this.selectedStorage,

      notes:
        this.notes.trim(),

      useBy:
        useBy.toISOString(),

      createdAt:
        new Date().toISOString(),
    };

    const sessions =
      this.getStoredSessions();

    sessions.push(session);

    sessions.sort(
      (a, b) =>
        new Date(
          b.pumpedAt,
        ).getTime() -
        new Date(
          a.pumpedAt,
        ).getTime(),
    );

    localStorage.setItem(
      'mumma-bear:pump-sessions',
      JSON.stringify(
        sessions,
      ),
    );

    localStorage.setItem(
      'mumma-bear:last-pump',
      JSON.stringify(
        session,
      ),
    );

    this.saved = true;

    this.currentTimestamp =
      Date.now();
  }

  goBack(): void {
    void this.router.navigate([
      '/today',
    ]);
  }

  viewPumpedMilk(): void {
    void this.router.navigate([
      '/pumped-milk',
    ]);
  }

  private setCurrentTime(): void {
    const now =
      new Date();

    this.selectedDate =
      this.toDateInputValue(
        now,
      );

    const hour24 =
      now.getHours();

    this.selectedHour =
      hour24 % 12 || 12;

    this.selectedPeriod =
      hour24 >= 12
        ? 'PM'
        : 'AM';

    this.selectedMinute =
      Math.round(
        now.getMinutes() /
          5,
      ) * 5;

    if (
      this.selectedMinute ===
      60
    ) {
      this.selectedMinute =
        0;

      const adjusted =
        new Date(now);

      adjusted.setMinutes(
        adjusted.getMinutes() +
          5,
      );

      const adjustedHour24 =
        adjusted.getHours();

      this.selectedHour =
        adjustedHour24 %
          12 ||
        12;

      this.selectedPeriod =
        adjustedHour24 >= 12
          ? 'PM'
          : 'AM';

      this.selectedDate =
        this.toDateInputValue(
          adjusted,
        );
    }

    this.saved = false;
  }

  private positionAllWheels(): void {
    const hourIndex =
      this.hours.indexOf(
        this.selectedHour,
      );

    const minuteIndex =
      this.minutes.indexOf(
        this.selectedMinute,
      );

    const periodIndex =
      this.periods.indexOf(
        this.selectedPeriod,
      );

    this.scrollWheelToIndex(
      this.hourWheel
        ?.nativeElement,
      hourIndex,
    );

    this.scrollWheelToIndex(
      this.minuteWheel
        ?.nativeElement,
      minuteIndex,
    );

    this.scrollWheelToIndex(
      this.periodWheel
        ?.nativeElement,
      periodIndex,
    );
  }

  private scrollWheelToIndex(
    element:
      | HTMLDivElement
      | undefined,
    index: number,
  ): void {
    if (
      !element ||
      index < 0
    ) {
      return;
    }

    element.scrollTop =
      index *
      this.wheelItemHeight;
  }

  private getWheelIndex(
    element: HTMLDivElement,
    length: number,
  ): number {
    const rawIndex =
      Math.round(
        element.scrollTop /
          this.wheelItemHeight,
      );

    return Math.max(
      0,
      Math.min(
        length - 1,
        rawIndex,
      ),
    );
  }

  private getSelectedDateOnly():
    | Date
    | null {
    if (!this.selectedDate) {
      return null;
    }

    const date =
      new Date(
        `${this.selectedDate}T00:00:00`,
      );

    return Number.isNaN(
      date.getTime(),
    )
      ? null
      : date;
  }

  private getSelectedDateTime():
    | Date
    | null {
    if (!this.selectedDate) {
      return null;
    }

    let hour24 =
      this.selectedHour %
      12;

    if (
      this.selectedPeriod ===
      'PM'
    ) {
      hour24 += 12;
    }

    const date =
      new Date(
        `${this.selectedDate}T${String(
          hour24,
        ).padStart(
          2,
          '0',
        )}:${String(
          this.selectedMinute,
        ).padStart(
          2,
          '0',
        )}:00`,
      );

    return Number.isNaN(
      date.getTime(),
    )
      ? null
      : date;
  }

  private calculateUseBy():
    | Date
    | null {
    const pumpedAt =
      this.getSelectedDateTime();

    if (!pumpedAt) {
      return null;
    }

    const useBy =
      new Date(pumpedAt);

    switch (
      this.selectedStorage
    ) {
      case 'room':
        useBy.setHours(
          useBy.getHours() +
            4,
        );
        break;

      case 'fridge':
        useBy.setDate(
          useBy.getDate() +
            4,
        );
        break;

      case 'freezer':
        useBy.setMonth(
          useBy.getMonth() +
            6,
        );
        break;
    }

    return useBy;
  }

  private getStoredSessions():
    PumpSession[] {
    const stored =
      localStorage.getItem(
        'mumma-bear:pump-sessions',
      );

    if (!stored) {
      return [];
    }

    try {
      const parsed =
        JSON.parse(stored);

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
      typeof crypto.randomUUID ===
        'function'
    ) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }

  private toDateInputValue(
    date: Date,
  ): string {
    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1,
      ).padStart(
        2,
        '0',
      );

    const day =
      String(
        date.getDate(),
      ).padStart(
        2,
        '0',
      );

    return `${year}-${month}-${day}`;
  }
}