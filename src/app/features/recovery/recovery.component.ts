import {
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
} from '@angular/router';
import {
  Subscription,
  filter,
} from 'rxjs';

type RecoveryFeeling =
  | ''
  | 'better'
  | 'same'
  | 'worse';

type RecoveryFlag =
  | ''
  | 'none'
  | 'pain'
  | 'bleeding'
  | 'feeding'
  | 'tired'
  | 'mood'
  | 'other';

interface RecoveryCheckIn {
  id: string;
  date: string;

  feeling?: RecoveryFeeling;
  flag?: RecoveryFlag;

  discomfortLevel:
    number | null;

  energyLevel:
    number | null;

  bleeding:
    | ''
    | 'none'
    | 'light'
    | 'moderate'
    | 'heavy';

  recoveryNotes: string;
  medicationNotes: string;
  notes: string;
  createdAt: string;
}

@Component({
  selector: 'app-recovery',
  standalone: true,
  imports: [],
  templateUrl:
    './recovery.component.html',
  styleUrl:
    './recovery.component.scss',
})
export class RecoveryComponent
  implements OnInit, OnDestroy
{
  private readonly router =
    inject(Router);

  private routerSubscription:
    Subscription | null =
      null;

  momName =
    localStorage.getItem(
      'mumma-bear:mom-name',
    ) || 'Mama';

  entries:
    RecoveryCheckIn[] = [];

  latestEntry:
    RecoveryCheckIn | null =
      null;


  ngOnInit(): void {
    this.loadEntries();

    this.routerSubscription =
      this.router.events
        .pipe(
          filter(
            (
              event,
            ): event is NavigationEnd =>
              event instanceof
              NavigationEnd,
          ),
        )
        .subscribe(
          (
            event,
          ) => {
            if (
              event.urlAfterRedirects ===
              '/me/recovery'
            ) {
              this.loadEntries();
            }
          },
        );
  }


  ngOnDestroy(): void {
    this.routerSubscription
      ?.unsubscribe();
  }


  goBack(): void {
    void this.router.navigate(
      ['/me'],
    );
  }


  addCheckIn(): void {
    void this.router.navigate(
      ['/me/recovery/new'],
    );
  }


  editEntry(
    entry: RecoveryCheckIn,
  ): void {
    void this.router.navigate(
      [
        '/me/recovery',
        entry.id,
        'edit',
      ],
    );
  }


  formatDate(
    dateValue: string,
  ): string {
    if (!dateValue) {
      return '';
    }

    const date =
      new Date(
        `${dateValue}T00:00:00`,
      );

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return dateValue;
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      },
    ).format(
      date,
    );
  }


  formatFeeling(
    value:
      RecoveryFeeling | undefined,
  ): string {
    switch (value) {
      case 'better':
        return 'Better';

      case 'same':
        return 'Same';

      case 'worse':
        return 'Worse';

      default:
        return 'Detailed check-in';
    }
  }


  formatFlag(
    value:
      RecoveryFlag | undefined,
  ): string {
    switch (value) {
      case 'none':
        return 'Nothing else';

      case 'pain':
        return 'Pain or soreness';

      case 'bleeding':
        return 'Bleeding';

      case 'feeding':
        return 'Feeding or breast comfort';

      case 'tired':
        return 'Very tired';

      case 'mood':
        return 'Mood or emotions';

      case 'other':
        return 'Something else';

      default:
        return '';
    }
  }


  hasQuickFeeling(
    entry: RecoveryCheckIn,
  ): boolean {
    return Boolean(
      entry.feeling,
    );
  }


  hasFlag(
    entry: RecoveryCheckIn,
  ): boolean {
    return Boolean(
      entry.flag &&
      entry.flag !== 'none',
    );
  }


  hasNote(
    entry: RecoveryCheckIn,
  ): boolean {
    return Boolean(
      entry.notes?.trim(),
    );
  }


  hasLegacyDetails(
    entry: RecoveryCheckIn,
  ): boolean {
    return Boolean(
      entry.discomfortLevel !== null ||
      entry.energyLevel !== null ||
      entry.bleeding ||
      entry.recoveryNotes ||
      entry.medicationNotes,
    );
  }


  legacySummary(
    entry: RecoveryCheckIn,
  ): string {
    const parts:
      string[] = [];

    if (
      entry.discomfortLevel !==
      null
    ) {
      parts.push(
        `Discomfort ${entry.discomfortLevel}/10`,
      );
    }

    if (
      entry.energyLevel !==
      null
    ) {
      parts.push(
        `Energy ${entry.energyLevel}/10`,
      );
    }

    if (
      entry.bleeding
    ) {
      parts.push(
        `Bleeding ${entry.bleeding}`,
      );
    }

    return (
      parts.join(' · ') ||
      'Earlier detailed recovery record'
    );
  }


  private loadEntries():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:recovery-checkins',
      );

    if (!stored) {
      this.entries = [];
      this.latestEntry =
        null;

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
        this.entries = [];
        this.latestEntry =
          null;

        return;
      }

      this.entries =
        (
          parsed as RecoveryCheckIn[]
        )
          .filter(
            (
              entry,
            ) =>
              Boolean(
                entry?.id &&
                entry?.date,
              ),
          )
          .sort(
            (
              a,
              b,
            ) =>
              this.getTimestamp(
                b.date,
              ) -
              this.getTimestamp(
                a.date,
              ),
          );

      this.latestEntry =
        this.entries[0] ||
        null;
    } catch {
      this.entries = [];
      this.latestEntry =
        null;
    }
  }


  private getTimestamp(
    value: string,
  ): number {
    const timestamp =
      new Date(
        `${value}T00:00:00`,
      ).getTime();

    return Number.isNaN(
      timestamp,
    )
      ? 0
      : timestamp;
  }
}