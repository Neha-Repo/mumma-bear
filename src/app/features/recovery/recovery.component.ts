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

interface RecoveryCheckIn {
  id: string;
  date: string;
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


  formatLevel(
    value:
      number | null,
  ): string {
    if (
      value === null
    ) {
      return 'Not recorded';
    }

    return `${value} / 10`;
  }


  formatBleeding(
    value: RecoveryCheckIn[
      'bleeding'
    ],
  ): string {
    if (!value) {
      return 'Not recorded';
    }

    return (
      value.charAt(0)
        .toUpperCase() +
      value.slice(1)
    );
  }


  hasDetails(
    entry: RecoveryCheckIn,
  ): boolean {
    return Boolean(
      entry.recoveryNotes ||
      entry.medicationNotes ||
      entry.notes,
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