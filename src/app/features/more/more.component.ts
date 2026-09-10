import {
  Component,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  BottomNavComponent,
} from '../../shared/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [
    BottomNavComponent,
  ],
  templateUrl:
    './more.component.html',
  styleUrl:
    './more.component.scss',
})
export class MoreComponent {

  private readonly router =
    inject(Router);


  openAppointments(): void {
    void this.router.navigate(
      ['/appointments'],
    );
  }


  openPumpedMilk(): void {
    void this.router.navigate(
      ['/pumped-milk'],
    );
  }


  openShowMeHow(): void {
    void this.router.navigate(
      ['/show-me-how'],
    );
  }

}