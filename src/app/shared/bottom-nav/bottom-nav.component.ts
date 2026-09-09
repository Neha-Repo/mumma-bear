import {
  Component,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

type MainTab =
  | 'today'
  | 'baby'
  | 'me'
  | 'reminders'
  | 'more';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  templateUrl:
    './bottom-nav.component.html',
  styleUrl:
    './bottom-nav.component.scss',
})
export class BottomNavComponent {
  private readonly router =
    inject(Router);

  navigate(
    tab: MainTab,
  ): void {
    switch (tab) {
      case 'today':
        void this.router.navigate(
          ['/today'],
        );
        break;

      case 'baby':
        void this.router.navigate(
          ['/baby'],
        );
        break;

      case 'me':
        void this.router.navigate(
          ['/me'],
        );
        break;

      case 'reminders':
        void this.router.navigate(
          ['/appointments'],
          {
            queryParams: {
              tab: 'reminders',
            },
          },
        );
        break;

      case 'more':
        void this.router.navigate(
          ['/more'],
        );
        break;
    }
  }


  isActive(
    tab: MainTab,
  ): boolean {
    const url =
      this.router.url;

    switch (tab) {
      case 'today':
        return url.startsWith(
          '/today',
        );

      case 'baby':
        return url.startsWith(
          '/baby',
        );

      case 'me':
        return url.startsWith(
          '/me',
        );

      case 'reminders':
        return (
          url.startsWith(
            '/appointments',
          ) &&
          url.includes(
            'tab=reminders',
          )
        );

      case 'more':
        return (
          url.startsWith(
            '/more',
          ) ||
          (
            url.startsWith(
              '/appointments',
            ) &&
            !url.includes(
              'tab=reminders',
            )
          )
        );

      default:
        return false;
    }
  }
}