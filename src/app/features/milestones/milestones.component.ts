import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';

interface MilestonePreview {
  title: string;
  text: string;
}

interface MilestoneStage {
  id: string;
  title: string;
  ageLabel: string;
  intro: string;
  previews: MilestonePreview[];
}

@Component({
  selector: 'app-milestones',
  standalone: true,
  imports: [],
  templateUrl:
    './milestones.component.html',
  styleUrl:
    './milestones.component.scss',
})
export class MilestonesComponent
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

  currentStage:
    MilestoneStage | null =
      null;

  hasDob =
    true;

  private readonly stages:
    MilestoneStage[] = [
      {
        id: '2-months',
        title: 'Around 2 months',
        ageLabel:
          'Early weeks to around 2 months',
        intro:
          'You may start noticing more looking, reacting and little moments of connection.',
        previews: [
          {
            title: 'Connection',
            text:
              'Looks at faces and may smile back during interaction.',
          },
          {
            title: 'Sounds',
            text:
              'May make sounds beyond crying and react to louder sounds.',
          },
          {
            title: 'Looking',
            text:
              'Watches you move and may look at a toy for a short time.',
          },
          {
            title: 'Movement',
            text:
              'May lift their head during tummy time and move both arms and legs.',
          },
        ],
      },

      {
        id: '4-months',
        title: 'Around 4 months',
        ageLabel:
          'Around 3 to 5 months',
        intro:
          'Interaction often becomes more obvious, with more sounds, smiles and purposeful movement.',
        previews: [
          {
            title: 'Social',
            text:
              'May smile for attention and begin chuckling during playful moments.',
          },
          {
            title: 'Conversation',
            text:
              'May coo, respond with sounds and turn toward your voice.',
          },
          {
            title: 'Curiosity',
            text:
              'May look at their hands and show interest in feeding cues.',
          },
          {
            title: 'Movement',
            text:
              'Head control may become steadier and hands may reach toward toys or the mouth.',
          },
        ],
      },

      {
        id: '6-months',
        title: 'Around 6 months',
        ageLabel:
          'Around 5 to 7 months',
        intro:
          'You may notice more exploring, laughing, reaching and stronger body control.',
        previews: [
          {
            title: 'People',
            text:
              'May recognise familiar people, laugh and enjoy looking in a mirror.',
          },
          {
            title: 'Sounds',
            text:
              'May take turns making sounds and experiment with squeals or raspberries.',
          },
          {
            title: 'Exploring',
            text:
              'May reach for wanted toys and explore safe objects with the mouth.',
          },
          {
            title: 'Movement',
            text:
              'May roll from tummy to back and use hands for support while sitting.',
          },
        ],
      },

      {
        id: '9-months',
        title: 'Around 9 months',
        ageLabel:
          'Around 7 to 10 months',
        intro:
          'Baby may be more expressive, mobile and interested in people and objects.',
        previews: [
          {
            title: 'People',
            text:
              'May respond to their name and react when you move away.',
          },
          {
            title: 'Expression',
            text:
              'May use many sounds and show a wider range of facial expressions.',
          },
          {
            title: 'Play',
            text:
              'May look for dropped objects and enjoy banging objects together.',
          },
          {
            title: 'Movement',
            text:
              'May sit without support and move objects from one hand to the other.',
          },
        ],
      },

      {
        id: '12-months',
        title: 'Around 12 months',
        ageLabel:
          'Around 10 to 12 months',
        intro:
          'Communication, play and movement may become increasingly intentional as the first year closes.',
        previews: [
          {
            title: 'Play',
            text:
              'May enjoy simple games with you such as pat-a-cake.',
          },
          {
            title: 'Communication',
            text:
              'May wave, use a special name for a parent and begin understanding “no”.',
          },
          {
            title: 'Thinking',
            text:
              'May look for hidden objects and put objects into containers.',
          },
          {
            title: 'Movement',
            text:
              'May pull to stand, move along furniture and pick up small items with finger and thumb.',
          },
        ],
      },
    ];


  ngOnInit(): void {
    this.loadCurrentStage();
  }


  goBack(): void {
    void this.router.navigate(
      ['/baby'],
    );
  }


  openDetails(): void {
    if (!this.currentStage) {
      return;
    }

    void this.router.navigate(
      [
        '/baby/milestones',
        this.currentStage.id,
      ],
    );
  }


    private loadCurrentStage():
    void {
    const storedDob =
      localStorage.getItem(
        'mumma-bear:baby-dob',
      );

    if (!storedDob) {
      this.hasDob =
        false;

      this.currentStage =
        this.stages[0];

      return;
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
      this.hasDob =
        false;

      this.currentStage =
        this.stages[0];

      return;
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

    const days =
      Math.max(
        0,
        Math.floor(
          (
            today.getTime() -
            dob.getTime()
          ) /
          86_400_000,
        ),
      );

    this.babyAgeText =
      this.formatAge(
        days,
      );

    if (days < 90) {
      this.currentStage =
        this.stages[0];

      return;
    }

    if (days < 150) {
      this.currentStage =
        this.stages[1];

      return;
    }

    if (days < 210) {
      this.currentStage =
        this.stages[2];

      return;
    }

    if (days < 300) {
      this.currentStage =
        this.stages[3];

      return;
    }

    this.currentStage =
      this.stages[4];
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
      Math.max(
        1,
        Math.floor(
          days / 30.44,
        ),
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