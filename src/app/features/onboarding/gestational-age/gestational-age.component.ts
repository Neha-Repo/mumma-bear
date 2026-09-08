import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';

type WheelType = 'weeks' | 'days';

@Component({
  selector: 'app-gestational-age',
  standalone: true,
  templateUrl: './gestational-age.component.html',
  styleUrl: './gestational-age.component.scss',
})
export class GestationalAgeComponent implements AfterViewInit {
  private readonly router = inject(Router);

  @ViewChildren('wheel')
  private wheels!: QueryList<ElementRef<HTMLElement>>;

  private readonly scrollTimers = new Map<
    WheelType,
    ReturnType<typeof setTimeout>
  >();

  readonly itemHeight = 52;

  readonly weeks = Array.from(
    { length: 17 },
    (_, index) => index + 20,
  );

  readonly days = [0, 1, 2, 3, 4, 5, 6];

  selectedWeeks = 36;
  selectedDays = 0;

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
    localStorage.setItem(
      'mumma-bear:gestational-age-weeks',
      String(this.selectedWeeks),
    );

    localStorage.setItem(
      'mumma-bear:gestational-age-days',
      String(this.selectedDays),
    );

    void this.router.navigate(['/onboarding/feeding']);
  }

  private updateSelection(
    type: WheelType,
    element: HTMLElement,
  ): void {
    if (type === 'weeks') {
      const index = this.getSelectedIndex(
        element,
        this.weeks.length,
      );

      this.selectedWeeks = this.weeks[index];
      return;
    }

    const index = this.getSelectedIndex(
      element,
      this.days.length,
    );

    this.selectedDays = this.days[index];
  }

  private snapWheel(
    type: WheelType,
    element: HTMLElement,
  ): void {
    const index =
      type === 'weeks'
        ? this.weeks.indexOf(this.selectedWeeks)
        : this.days.indexOf(this.selectedDays);

    element.scrollTo({
      top: index * this.itemHeight,
      behavior: 'smooth',
    });
  }

  private positionWheels(): void {
    const wheels = this.wheels.toArray();

    this.scrollToIndex(
      wheels[0],
      this.weeks.indexOf(this.selectedWeeks),
    );

    this.scrollToIndex(
      wheels[1],
      this.days.indexOf(this.selectedDays),
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
}