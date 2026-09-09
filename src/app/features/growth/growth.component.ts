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

interface GrowthEntry {
  id: string;
  date: string;
  weightKg:
    number | null;
  lengthCm:
    number | null;
  headCm:
    number | null;
  notes: string;
  createdAt: string;
}

type GrowthMetric =
  | 'weight'
  | 'length'
  | 'head';

interface ChartMeasurement {
  id: string;
  date: string;
  value: number;
}

interface ChartPoint
  extends ChartMeasurement {
  x: number;
  y: number;
}

@Component({
  selector: 'app-growth',
  standalone: true,
  imports: [],
  templateUrl:
    './growth.component.html',
  styleUrl:
    './growth.component.scss',
})
export class GrowthComponent
  implements OnInit, OnDestroy
{
  private readonly router =
    inject(Router);

  private routerSubscription:
    Subscription | null =
      null;

  private readonly chartWidth =
    320;

  private readonly chartHeight =
    190;

  private readonly chartPaddingLeft =
    38;

  private readonly chartPaddingRight =
    14;

  private readonly chartPaddingTop =
    18;

  private readonly chartPaddingBottom =
    34;

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  entries:
    GrowthEntry[] = [];

  latestEntry:
    GrowthEntry | null =
      null;

  selectedMetric:
    GrowthMetric =
      'weight';


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
              '/baby/growth'
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
      ['/baby'],
    );
  }


  addMeasurement(): void {
    void this.router.navigate(
      ['/baby/growth/new'],
    );
  }


  editEntry(
    entry: GrowthEntry,
  ): void {
    void this.router.navigate(
      [
        '/baby/growth',
        entry.id,
        'edit',
      ],
    );
  }


  hasAnyMeasurement(
    entry: GrowthEntry,
  ): boolean {
    return (
      entry.weightKg !== null ||
      entry.lengthCm !== null ||
      entry.headCm !== null
    );
  }


  setChartMetric(
    metric: GrowthMetric,
  ): void {
    this.selectedMetric =
      metric;
  }


  metricEntryCount(
    metric: GrowthMetric,
  ): number {
    return this.entries.filter(
      (
        entry,
      ) =>
        this.getMetricValue(
          entry,
          metric,
        ) !== null,
    ).length;
  }


  get chartMeasurements():
    ChartMeasurement[] {
    return this.entries
      .map(
        (
          entry,
        ) => {
          const value =
            this.getMetricValue(
              entry,
              this.selectedMetric,
            );

          if (
            value === null
          ) {
            return null;
          }

          return {
            id:
              entry.id,
            date:
              entry.date,
            value,
          };
        },
      )
      .filter(
        (
          measurement,
        ): measurement is ChartMeasurement =>
          measurement !==
          null,
      )
      .sort(
        (
          a,
          b,
        ) =>
          this.getDateTimestamp(
            a.date,
          ) -
          this.getDateTimestamp(
            b.date,
          ),
      );
  }


  get hasChartTrend():
    boolean {
    return (
      this.chartMeasurements
        .length >= 2
    );
  }


  get chartPoints():
    ChartPoint[] {
    const measurements =
      this.chartMeasurements;

    if (
      measurements.length ===
      0
    ) {
      return [];
    }

    const values =
      measurements.map(
        (
          measurement,
        ) =>
          measurement.value,
      );

    const rawMin =
      Math.min(
        ...values,
      );

    const rawMax =
      Math.max(
        ...values,
      );

    let min =
      rawMin;

    let max =
      rawMax;

    if (
      rawMin === rawMax
    ) {
      const padding =
        rawMin === 0
          ? 1
          : Math.max(
              rawMin * 0.1,
              0.5,
            );

      min =
        rawMin -
        padding;

      max =
        rawMax +
        padding;
    } else {
      const range =
        rawMax -
        rawMin;

      const padding =
        range *
        0.15;

      min =
        rawMin -
        padding;

      max =
        rawMax +
        padding;
    }

    const drawingWidth =
      this.chartWidth -
      this.chartPaddingLeft -
      this.chartPaddingRight;

    const drawingHeight =
      this.chartHeight -
      this.chartPaddingTop -
      this.chartPaddingBottom;

    return measurements.map(
      (
        measurement,
        index,
      ) => {
        const x =
          measurements.length ===
          1
            ? this.chartPaddingLeft +
              drawingWidth / 2
            : this.chartPaddingLeft +
              (
                index /
                (
                  measurements.length -
                  1
                )
              ) *
                drawingWidth;

        const y =
          this.chartPaddingTop +
          (
            (
              max -
              measurement.value
            ) /
            (
              max -
              min
            )
          ) *
            drawingHeight;

        return {
          ...measurement,
          x,
          y,
        };
      },
    );
  }


  get chartPolyline():
    string {
    return this.chartPoints
      .map(
        (
          point,
        ) =>
          `${point.x},${point.y}`,
      )
      .join(' ');
  }


  get chartMinimum():
    number | null {
    const values =
      this.chartMeasurements
        .map(
          (
            item,
          ) =>
            item.value,
        );

    if (
      values.length ===
      0
    ) {
      return null;
    }

    return Math.min(
      ...values,
    );
  }


  get chartMaximum():
    number | null {
    const values =
      this.chartMeasurements
        .map(
          (
            item,
          ) =>
            item.value,
        );

    if (
      values.length ===
      0
    ) {
      return null;
    }

    return Math.max(
      ...values,
    );
  }


  get chartStartDate():
    string {
    const measurements =
      this.chartMeasurements;

    if (
      measurements.length ===
      0
    ) {
      return '';
    }

    return this.formatShortDate(
      measurements[0].date,
    );
  }


  get chartEndDate():
    string {
    const measurements =
      this.chartMeasurements;

    if (
      measurements.length ===
      0
    ) {
      return '';
    }

    return this.formatShortDate(
      measurements[
        measurements.length -
        1
      ].date,
    );
  }


  get selectedMetricLabel():
    string {
    switch (
      this.selectedMetric
    ) {
      case 'weight':
        return 'Weight';

      case 'length':
        return 'Length / height';

      case 'head':
        return 'Head circumference';
    }
  }


  get selectedMetricUnit():
    string {
    return this.selectedMetric ===
      'weight'
      ? 'kg'
      : 'cm';
  }


  formatChartValue(
    value:
      number | null,
  ): string {
    if (
      value === null
    ) {
      return '';
    }

    return `${this.cleanNumber(
      value,
    )} ${this.selectedMetricUnit}`;
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


  formatWeight(
    value:
      number | null,
  ): string {
    if (
      value === null
    ) {
      return 'Not recorded';
    }

    return `${this.cleanNumber(
      value,
    )} kg`;
  }


  formatLength(
    value:
      number | null,
  ): string {
    if (
      value === null
    ) {
      return 'Not recorded';
    }

    return `${this.cleanNumber(
      value,
    )} cm`;
  }


  private loadEntries():
    void {
    const stored =
      localStorage.getItem(
        'mumma-bear:growth-entries',
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
          parsed as GrowthEntry[]
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
              this.getDateTimestamp(
                b.date,
              ) -
              this.getDateTimestamp(
                a.date,
              ),
          );

      this.latestEntry =
        this.entries[0] ||
        null;

      this.ensureUsefulMetricSelected();
    } catch {
      this.entries = [];
      this.latestEntry =
        null;
    }
  }


  private ensureUsefulMetricSelected():
    void {
    if (
      this.metricEntryCount(
        this.selectedMetric,
      ) > 0
    ) {
      return;
    }

    const metrics:
      GrowthMetric[] = [
        'weight',
        'length',
        'head',
      ];

    const firstAvailable =
      metrics.find(
        (
          metric,
        ) =>
          this.metricEntryCount(
            metric,
          ) > 0,
      );

    if (
      firstAvailable
    ) {
      this.selectedMetric =
        firstAvailable;
    }
  }


  private getMetricValue(
    entry: GrowthEntry,
    metric: GrowthMetric,
  ): number | null {
    switch (metric) {
      case 'weight':
        return entry.weightKg;

      case 'length':
        return entry.lengthCm;

      case 'head':
        return entry.headCm;
    }
  }


  private formatShortDate(
    dateValue: string,
  ): string {
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
      },
    ).format(
      date,
    );
  }


  private getDateTimestamp(
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


  private cleanNumber(
    value: number,
  ): string {
    return Number(
      value.toFixed(2),
    ).toString();
  }
}