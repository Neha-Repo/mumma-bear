import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';

type WheelType = 'day' | 'month' | 'year';

@Component({
  selector: 'app-baby-dob',
  standalone: true,
  templateUrl: './baby-dob.component.html',
  styleUrl: './baby-dob.component.scss',
})
export class BabyDobComponent implements AfterViewInit {
  private readonly router = inject(Router);

  @ViewChildren('wheel')
  private wheels!: QueryList<ElementRef<HTMLElement>>;

  private readonly scrollTimers = new Map<WheelType, ReturnType<typeof setTimeout>>();

  readonly itemHeight = 52;

  readonly months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  readonly today = new Date();
  readonly years = this.createYearRange();

  selectedDay = this.today.getDate();
  selectedMonth = this.today.getMonth();
  selectedYear = this.today.getFullYear();

  get availableMonths(): number[] {
    const lastMonth =
      this.selectedYear === this.today.getFullYear()
        ? this.today.getMonth()
        : 11;

    return Array.from(
      { length: lastMonth + 1 },
      (_, index) => index,
    );
  }

  get days(): number[] {
    const daysInMonth = new Date(
      this.selectedYear,
      this.selectedMonth + 1,
      0,
    ).getDate();

    const lastDay =
      this.selectedYear === this.today.getFullYear() &&
      this.selectedMonth === this.today.getMonth()
        ? this.today.getDate()
        : daysInMonth;

    return Array.from(
      { length: lastDay },
      (_, index) => index + 1,
    );
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => this.positionWheels());
  }

  onWheelScroll(
    type: WheelType,
    element: HTMLElement,
  ): void {
    const existingTimer = this.scrollTimers.get(type);

    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.updateSelection(type, element);
      this.snapWheel(type, element);
    }, 100);

    this.scrollTimers.set(type, timer);
  }

  continue(): void {
    const month = String(this.selectedMonth + 1).padStart(2, '0');
    const day = String(this.selectedDay).padStart(2, '0');

    localStorage.setItem(
      'mumma-bear:baby-dob',
      `${this.selectedYear}-${month}-${day}`,
    );

    void this.router.navigate(['/onboarding/premature']);
  }

  private updateSelection(
    type: WheelType,
    element: HTMLElement,
  ): void {
    if (type === 'day') {
      const index = this.getSelectedIndex(
        element,
        this.days.length,
      );

      this.selectedDay = this.days[index];
      return;
    }

    if (type === 'month') {
      const index = this.getSelectedIndex(
        element,
        this.availableMonths.length,
      );

      this.selectedMonth = this.availableMonths[index];
      this.ensureValidDay();
      return;
    }

    const index = this.getSelectedIndex(
      element,
      this.years.length,
    );

    const year = this.years[index];

    if (year === this.selectedYear) {
      return;
    }

    this.selectedYear = year;

    if (
      year === this.today.getFullYear() &&
      this.selectedMonth > this.today.getMonth()
    ) {
      this.selectedMonth = this.today.getMonth();
    }

    this.ensureValidDay();

    requestAnimationFrame(() => {
      const wheels = this.wheels.toArray();

      this.scrollToIndex(
        wheels[1],
        this.availableMonths.indexOf(this.selectedMonth),
      );

      this.scrollToIndex(
        wheels[0],
        this.selectedDay - 1,
      );
    });
  }

  private snapWheel(
    type: WheelType,
    element: HTMLElement,
  ): void {
    let index = 0;

    if (type === 'day') {
      index = this.selectedDay - 1;
    }

    if (type === 'month') {
      index = this.availableMonths.indexOf(this.selectedMonth);
    }

    if (type === 'year') {
      index = this.years.indexOf(this.selectedYear);
    }

    element.scrollTo({
      top: index * this.itemHeight,
      behavior: 'smooth',
    });
  }

  private positionWheels(): void {
    const wheels = this.wheels.toArray();

    this.scrollToIndex(
      wheels[0],
      this.selectedDay - 1,
    );

    this.scrollToIndex(
      wheels[1],
      this.availableMonths.indexOf(this.selectedMonth),
    );

    this.scrollToIndex(
      wheels[2],
      this.years.indexOf(this.selectedYear),
    );
  }

  private getSelectedIndex(
    element: HTMLElement,
    itemCount: number,
  ): number {
    const index = Math.round(
      element.scrollTop / this.itemHeight,
    );

    return Math.max(
      0,
      Math.min(index, itemCount - 1),
    );
  }

  private scrollToIndex(
    element: ElementRef<HTMLElement> | undefined,
    index: number,
  ): void {
    element?.nativeElement.scrollTo({
      top: index * this.itemHeight,
      behavior: 'instant',
    });
  }

  private ensureValidDay(): void {
    if (this.selectedDay > this.days.length) {
      this.selectedDay = this.days.length;
    }
  }

  private createYearRange(): number[] {
    const currentYear = this.today.getFullYear();

    return [
      currentYear,
      currentYear - 1,
    ];
  }
}