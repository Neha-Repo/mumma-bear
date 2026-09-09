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

interface FormulaFeedSession {
  id: string;
  type: 'formula';
  babyName: string;
  fedAt: string;
  amountMl: number;
  amountOz: number;
  formulaName: string;
  notes: string;
  createdAt: string;
}

interface StoredFeedingSession {
  type?: string;
  amountMl?: number;
}

@Component({
  selector: 'app-formula-feed',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl:
    './formula-feed.component.html',
  styleUrl:
    './formula-feed.component.scss',
})
export class FormulaFeedComponent
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

  private readonly rowHeight =
    58;

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  amounts =
    Array.from(
      {
        length: 35,
      },
      (
        _,
        index,
      ) =>
        (
          index + 1
        ) * 10,
    );

  selectedAmountMl =
    this.getInitialAmount();

  fedAt =
    new Date();

  formulaName = '';

  notes = '';

  isSaved = false;


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


  get amountOz(): number {
    return Number(
      (
        this.selectedAmountMl /
        29.5735
      ).toFixed(1),
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
    if (this.isSaved) {
      return;
    }

    const now =
      new Date();

    const session:
      FormulaFeedSession = {
        id:
          this.createId(),

        type:
          'formula',

        babyName:
          this.babyName,

        fedAt:
          this.fedAt
            .toISOString(),

        amountMl:
          this.selectedAmountMl,

        amountOz:
          this.amountOz,

        formulaName:
          this.formulaName
            .trim(),

        notes:
          this.notes
            .trim(),

        createdAt:
          now.toISOString(),
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

    localStorage.setItem(
      'mumma-bear:last-formula-amount',
      this.selectedAmountMl
        .toString(),
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


  private updateAmountFromScroll():
    void {
    const wheel =
      this.amountWheel
        ?.nativeElement;

    if (!wheel) {
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


  private getInitialAmount():
    number {
    const storedAmount =
      Number(
        localStorage.getItem(
          'mumma-bear:last-formula-amount',
        ),
      );

    if (
      Number.isFinite(
        storedAmount,
      ) &&
      storedAmount >= 10 &&
      storedAmount <= 350 &&
      storedAmount % 10 === 0
    ) {
      return storedAmount;
    }

    const sessions =
      this.loadExistingSessions();

    const previousFormula =
      sessions.find(
        (
          session:
            StoredFeedingSession,
        ) =>
          session.type ===
            'formula' &&
          typeof session.amountMl ===
            'number',
      );

    if (
      previousFormula &&
      previousFormula.amountMl &&
      previousFormula.amountMl >=
        10 &&
      previousFormula.amountMl <=
        350
    ) {
      const rounded =
        Math.round(
          previousFormula.amountMl /
            10,
        ) * 10;

      return Math.min(
        350,
        Math.max(
          10,
          rounded,
        ),
      );
    }

    return 70;
  }


  private loadExistingSessions():
    Array<
      FormulaFeedSession |
      StoredFeedingSession
    > {
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