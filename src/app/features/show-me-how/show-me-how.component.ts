import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  minDays: number;
  maxDays: number | null;
}

@Component({
  selector: 'app-show-me-how',
  standalone: true,
  imports: [],
  templateUrl:
    './show-me-how.component.html',
  styleUrl:
    './show-me-how.component.scss',
})
export class ShowMeHowComponent
  implements OnInit
{
  private readonly router =
    inject(Router);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  babyAgeText =
    '';

  relevantGuides:
    Guide[] = [];

  moreGuides:
    Guide[] = [];

  private readonly guides:
    Guide[] = [
      {
        id: 'burping',
        title: 'Burping baby',
        description:
          'Three gentle positions to help bring up trapped air.',
        category: 'Feeding',
        image:
          'assets/images/burping.webp',
        imageAlt:
          'Illustration for burping baby',
        minDays: 0,
        maxDays: 180,
      },
      {
        id: 'swaddling',
        title: 'Swaddling',
        description:
          'A simple visual guide to wrapping baby comfortably.',
        category: 'Baby basics',
        image:
          'assets/images/swaddling.webp',
        imageAlt:
          'Illustration for swaddling baby',
        minDays: 0,
        maxDays: 90,
      },
      {
        id: 'cord-care',
        title: 'Cord care',
        description:
          'Simple everyday care while the cord stump is still present.',
        category: 'Baby basics',
        image:
          'assets/images/cord-care.webp',
        imageAlt:
          'Illustration for baby cord care',
        minDays: 0,
        maxDays: 30,
      },
      {
        id: 'diaper-change',
        title: 'Changing a diaper',
        description:
          'A quick, calm changing routine from start to finish.',
        category: 'Baby basics',
        image:
          'assets/images/diaper-change.webp',
        imageAlt:
          'Illustration for changing a diaper',
        minDays: 0,
        maxDays: 365,
      },
      {
        id: 'bathing',
        title: 'Bathing baby',
        description:
          'Set up first, then follow a short washing routine.',
        category: 'Baby basics',
        image:
          'assets/images/bathing.webp',
        imageAlt:
          'Illustration for bathing baby',
        minDays: 7,
        maxDays: 365,
      },
      {
        id: 'safe-sleep',
        title: 'Safe sleep setup',
        description:
          'A simple visual reminder for setting up baby’s sleep space.',
        category: 'Sleep',
        image:
          'assets/images/safe-sleep.webp',
        imageAlt:
          'Illustration for safe sleep setup',
        minDays: 0,
        maxDays: 365,
      },
      {
        id: 'tummy-time',
        title: 'Tummy time',
        description:
          'Easy ways to make short tummy-time moments feel manageable.',
        category: 'Development',
        image:
          'assets/images/tummy-time.webp',
        imageAlt:
          'Illustration for tummy time',
        minDays: 14,
        maxDays: 210,
      },
      {
        id: 'bottle-feeding',
        title: 'Bottle feeding',
        description:
          'Comfortable positioning and a simple paced feeding flow.',
        category: 'Feeding',
        image:
          'assets/images/bottle-feeding.webp',
        imageAlt:
          'Illustration for bottle feeding',
        minDays: 0,
        maxDays: 365,
      },
      {
        id: 'pump-assembly',
        title: 'Pump setup',
        description:
          'A simple order for assembling the main pump parts.',
        category: 'Pumping',
        image:
          'assets/images/pump-setup.webp',
        imageAlt:
          'Illustration for pump setup',
        minDays: 0,
        maxDays: 365,
      },
      {
        id: 'starting-solids',
        title: 'Starting solids',
        description:
          'A simple setup for those first tastes when baby is ready.',
        category: 'Feeding',
        image:
          'assets/images/starting-solids.webp',
        imageAlt:
          'Illustration for starting solids',
        minDays: 150,
        maxDays: 240,
      },
      {
        id: 'cup-introduction',
        title: 'Introducing a cup',
        description:
          'A gentle first introduction to drinking from a small cup.',
        category: 'Feeding',
        image:
          'assets/images/cup-introduction.webp',
        imageAlt:
          'Illustration for introducing a cup',
        minDays: 180,
        maxDays: 365,
      },
      {
        id: 'baby-proofing',
        title: 'Baby-proofing basics',
        description:
          'A quick room-level check as baby becomes more mobile.',
        category: 'Home',
        image:
          'assets/images/baby-proofing.webp',
        imageAlt:
          'Illustration for baby-proofing basics',
        minDays: 180,
        maxDays: null,
      },
    ];


  ngOnInit(): void {
    this.loadGuides();
  }


  goBack(): void {
    void this.router.navigate(
      ['/more'],
    );
  }


  openGuide(
    guide: Guide,
  ): void {
    void this.router.navigate(
      [
        '/show-me-how',
        guide.id,
      ],
    );
  }


  private loadGuides():
    void {
    const ageDays =
      this.getBabyAgeDays();

    if (ageDays === null) {
      this.relevantGuides =
        this.guides.slice(
          0,
          5,
        );

      this.moreGuides =
        this.guides.slice(
          5,
        );

      return;
    }

    this.babyAgeText =
      this.formatAge(
        ageDays,
      );

    this.relevantGuides =
      this.guides
        .filter(
          (
            guide,
          ) =>
            ageDays >=
              guide.minDays &&
            (
              guide.maxDays ===
                null ||
              ageDays <=
                guide.maxDays
            ),
        )
        .slice(
          0,
          6,
        );

    const relevantIds =
      new Set(
        this.relevantGuides.map(
          (
            guide,
          ) =>
            guide.id,
        ),
      );

    this.moreGuides =
      this.guides.filter(
        (
          guide,
        ) =>
          !relevantIds.has(
            guide.id,
          ),
      );
  }


  private getBabyAgeDays():
    number | null {
    const storedDob =
      localStorage.getItem(
        'mumma-bear:baby-dob',
      );

    if (!storedDob) {
      return null;
    }

    const dob =
      new Date(
        `${storedDob}T00:00:00`,
      );

    if (
      Number.isNaN(
        dob.getTime(),
      )
    ) {
      return null;
    }

    const today =
      new Date();

    dob.setHours(
      0,
      0,
      0,
      0,
    );

    today.setHours(
      0,
      0,
      0,
      0,
    );

    return Math.max(
      0,
      Math.floor(
        (
          today.getTime() -
          dob.getTime()
        ) /
        86_400_000,
      ),
    );
  }


  private formatAge(
    days: number,
  ): string {
    if (days === 0) {
      return 'Born today';
    }

    if (days < 7) {
      return `${days} ${
        days === 1
          ? 'day'
          : 'days'
      } old`;
    }

    if (days < 84) {
      const weeks =
        Math.floor(
          days / 7,
        );

      return `${weeks} ${
        weeks === 1
          ? 'week'
          : 'weeks'
      } old`;
    }

    const months =
      Math.floor(
        days / 30.44,
      );

    if (months < 12) {
      return `${months} ${
        months === 1
          ? 'month'
          : 'months'
      } old`;
    }

    return 'Around 1 year old';
  }
}