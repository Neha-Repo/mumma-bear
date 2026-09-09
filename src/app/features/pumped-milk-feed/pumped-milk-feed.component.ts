import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type StorageLocation =
  | 'room'
  | 'fridge'
  | 'freezer';

interface PumpSession {
  id: string;
  pumpedAt: string;
  amountMl: number | null;
  storageLocation: StorageLocation;
  notes: string;
  useBy: string;
  createdAt: string;
}

interface MilkAllocation {
  pumpSessionId: string;
  amountMl: number;
}

interface PumpedMilkFeedSession {
  id: string;
  type: 'pumped-milk';
  babyName: string;
  fedAt: string;
  amountMl: number;
  amountOz: number;
  allocations: MilkAllocation[];
  notes: string;
  createdAt: string;
}

@Component({
  selector: 'app-pumped-milk-feed',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl:
    './pumped-milk-feed.component.html',
  styleUrl:
    './pumped-milk-feed.component.scss',
})
export class PumpedMilkFeedComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild(
    'amountWheel',
  )
  amountWheel?:
    ElementRef<HTMLDivElement>;

  private router =
    inject(Router);

  private scrollTimer:
    | ReturnType<typeof setTimeout>
    | null = null;

  private rowHeight = 58;

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  pumpSessions:
    PumpSession[] = [];

  amounts:
    number[] = [];

  selectedAmountMl = 0;

  fedAt =
    new Date();

  notes = '';

  isSaved = false;


  constructor() {
    this.loadPumpSessions();
    this.buildAmountOptions();
  }


  ngAfterViewInit(): void {
    setTimeout(
      () => {
        this.scrollToSelectedAmount(
          false,
        );
      },
      0,
    );
  }


  ngOnDestroy(): void {
    if (
      this.scrollTimer !== null
    ) {
      clearTimeout(
        this.scrollTimer,
      );
    }
  }


  get activeMilkSessions():
    PumpSession[] {
    const now =
      Date.now();

    return this.pumpSessions
      .filter(
        (session) => {
          if (
            session.amountMl ===
              null ||
            session.amountMl <= 0
          ) {
            return false;
          }

          const useBy =
            new Date(
              session.useBy,
            ).getTime();

          return (
            !Number.isNaN(
              useBy,
            ) &&
            useBy > now
          );
        },
      )
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


  get totalAvailableMl():
    number {
    return this.activeMilkSessions
      .reduce(
        (
          total,
          session,
        ) =>
          total +
          (
            session.amountMl ??
            0
          ),
        0,
      );
  }


  get amountOz(): number {
    if (
      this.selectedAmountMl <=
      0
    ) {
      return 0;
    }

    return Number(
      (
        this.selectedAmountMl /
        29.5735
      ).toFixed(1),
    );
  }


  get hasMilk(): boolean {
    return (
      this.totalAvailableMl >
      0
    );
  }


  get canSave(): boolean {
    return (
      !this.isSaved &&
      this.hasMilk &&
      this.selectedAmountMl >
        0 &&
      this.selectedAmountMl <=
        this.totalAvailableMl
    );
  }


  get dateText(): string {
    const today =
      new Date();

    const selected =
      new Date(
        this.fedAt,
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
      this.fedAt,
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
      this.fedAt,
    );
  }


  get nextMilkText(): string {
    const first =
      this.activeMilkSessions[0];

    if (!first) {
      return 'No usable milk';
    }

    const amount =
      first.amountMl ?? 0;

    const location =
      this.storageLabel(
        first.storageLocation,
      );

    return `${amount} ml · ${location}`;
  }


  get nextMilkUseByText():
    string {
    const first =
      this.activeMilkSessions[0];

    if (!first) {
      return '';
    }

    return `Use by ${this.formatDateTime(
      first.useBy,
    )}`;
  }


  goBack(): void {
    void this.router.navigate(
      ['/feed'],
    );
  }


  setNow(): void {
    this.fedAt =
      new Date();
  }


  selectAmount(
    amount: number,
  ): void {
    this.selectedAmountMl =
      amount;

    this.scrollToSelectedAmount(
      true,
    );
  }


  onAmountScroll(): void {
    if (
      this.scrollTimer !== null
    ) {
      clearTimeout(
        this.scrollTimer,
      );
    }

    this.scrollTimer =
      setTimeout(
        () => {
          this.updateAmountFromScroll();
        },
        80,
      );
  }


  saveFeed(): void {
    if (!this.canSave) {
      return;
    }

    const allocations =
      this.consumeMilk(
        this.selectedAmountMl,
      );

    const consumedTotal =
      allocations.reduce(
        (
          total,
          allocation,
        ) =>
          total +
          allocation.amountMl,
        0,
      );

    if (
      consumedTotal !==
      this.selectedAmountMl
    ) {
      return;
    }

    const session:
      PumpedMilkFeedSession = {
        id:
          this.createId(),

        type:
          'pumped-milk',

        babyName:
          this.babyName,

        fedAt:
          this.fedAt
            .toISOString(),

        amountMl:
          this.selectedAmountMl,

        amountOz:
          this.amountOz,

        allocations,

        notes:
          this.notes.trim(),

        createdAt:
          new Date()
            .toISOString(),
      };

    const feedingSessions =
      this.loadFeedingSessions();

    feedingSessions.unshift(
      session,
    );

    localStorage.setItem(
      'mumma-bear:pump-sessions',
      JSON.stringify(
        this.pumpSessions,
      ),
    );

    localStorage.setItem(
      'mumma-bear:feeding-sessions',
      JSON.stringify(
        feedingSessions,
      ),
    );

    localStorage.setItem(
      'mumma-bear:last-feed',
      JSON.stringify(
        session,
      ),
    );

    this.refreshLastPump();

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


  private loadPumpSessions():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:pump-sessions',
      );

    if (!stored) {
      this.pumpSessions =
        [];

      return;
    }

    try {
      const parsed =
        JSON.parse(
          stored,
        );

      this.pumpSessions =
        Array.isArray(
          parsed,
        )
          ? parsed
          : [];
    } catch {
      this.pumpSessions =
        [];
    }
  }


  private buildAmountOptions():
    void {
    const total =
      this.totalAvailableMl;

    if (total <= 0) {
      this.amounts = [];
      this.selectedAmountMl =
        0;

      return;
    }

    const options:
      number[] = [];

    for (
      let amount = 10;
      amount <= total;
      amount += 10
    ) {
      options.push(
        amount,
      );
    }

    /*
     * Pump amounts can occasionally
     * end on a value that is not a
     * multiple of 10. Include the
     * exact total so all remaining
     * milk can still be logged.
     */
    if (
      total % 10 !== 0
    ) {
      options.push(
        total,
      );
    }

    this.amounts =
      options;

    const previous =
      Number(
        localStorage.getItem(
          'mumma-bear:last-pumped-feed-amount',
        ),
      );

    if (
      Number.isFinite(
        previous,
      ) &&
      this.amounts.includes(
        previous,
      )
    ) {
      this.selectedAmountMl =
        previous;

      return;
    }

    if (
      this.amounts.includes(
        70,
      )
    ) {
      this.selectedAmountMl =
        70;

      return;
    }

    this.selectedAmountMl =
      this.amounts[
        Math.min(
          this.amounts.length -
            1,
          0,
        )
      ] ?? 0;
  }


  private updateAmountFromScroll():
    void {
    const wheel =
      this.amountWheel
        ?.nativeElement;

    if (
      !wheel ||
      this.amounts.length ===
        0
    ) {
      return;
    }

    const index =
      Math.round(
        wheel.scrollTop /
        this.rowHeight,
      );

    const safeIndex =
      Math.max(
        0,
        Math.min(
          index,
          this.amounts.length - 1,
        ),
      );

    this.selectedAmountMl =
      this.amounts[
        safeIndex
      ];
  }


  private scrollToSelectedAmount(
    smooth: boolean,
  ): void {
    const wheel =
      this.amountWheel
        ?.nativeElement;

    if (!wheel) {
      return;
    }

    const index =
      this.amounts.indexOf(
        this.selectedAmountMl,
      );

    if (index < 0) {
      return;
    }

    wheel.scrollTo({
      top:
        index *
        this.rowHeight,

      behavior:
        smooth
          ? 'smooth'
          : 'auto',
    });
  }


  private consumeMilk(
    requestedAmount:
      number,
  ): MilkAllocation[] {
    let remaining =
      requestedAmount;

    const allocations:
      MilkAllocation[] = [];

    const usable =
      this.activeMilkSessions;

    for (
      const session
      of usable
    ) {
      if (remaining <= 0) {
        break;
      }

      const available =
        session.amountMl ??
        0;

      if (available <= 0) {
        continue;
      }

      const used =
        Math.min(
          available,
          remaining,
        );

      session.amountMl =
        available -
        used;

      allocations.push({
        pumpSessionId:
          session.id,

        amountMl:
          used,
      });

      remaining -=
        used;
    }

    if (remaining > 0) {
      /*
       * Defensive rollback. This
       * should not happen because
       * canSave checks availability.
       */
      for (
        const allocation
        of allocations
      ) {
        const session =
          this.pumpSessions.find(
            (item) =>
              item.id ===
              allocation.pumpSessionId,
          );

        if (session) {
          session.amountMl =
            (
              session.amountMl ??
              0
            ) +
            allocation.amountMl;
        }
      }

      return [];
    }

    localStorage.setItem(
      'mumma-bear:last-pumped-feed-amount',
      requestedAmount
        .toString(),
    );

    return allocations;
  }


  private refreshLastPump():
    void {
    const latest =
      [...this.pumpSessions]
        .sort(
          (a, b) =>
            new Date(
              b.pumpedAt,
            ).getTime() -
            new Date(
              a.pumpedAt,
            ).getTime(),
        )[0];

    if (!latest) {
      localStorage.removeItem(
        'mumma-bear:last-pump',
      );

      return;
    }

    localStorage.setItem(
      'mumma-bear:last-pump',
      JSON.stringify(
        latest,
      ),
    );
  }


  private loadFeedingSessions():
    unknown[] {
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

      return Array.isArray(
        parsed,
      )
        ? parsed
        : [];
    } catch {
      return [];
    }
  }


  private storageLabel(
    storage:
      StorageLocation,
  ): string {
    switch (storage) {
      case 'room':
        return 'Room temp';

      case 'fridge':
        return 'Fridge';

      case 'freezer':
        return 'Freezer';
    }
  }


  private formatDateTime(
    value: string,
  ): string {
    const date =
      new Date(
        value,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return '';
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      },
    ).format(
      date,
    );
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