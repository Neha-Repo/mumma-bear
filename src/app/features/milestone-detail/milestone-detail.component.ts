import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

interface MilestoneGroup {
  title: string;
  items: string[];
}

interface MilestoneStage {
  id: string;
  title: string;
  subtitle: string;
  groups: MilestoneGroup[];
}

@Component({
  selector:
    'app-milestone-detail',
  standalone: true,
  imports: [],
  templateUrl:
    './milestone-detail.component.html',
  styleUrl:
    './milestone-detail.component.scss',
})
export class MilestoneDetailComponent
  implements OnInit
{
  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  stage:
    MilestoneStage | null =
      null;

  private readonly stages:
    MilestoneStage[] = [
      {
        id: '2-months',
        title: 'Around 2 months',
        subtitle:
          'Early connection, looking, sounds and movement.',
        groups: [
          {
            title:
              'Connecting with you',
            items: [
              'May calm when spoken to or picked up.',
              'May look at your face.',
              'May seem pleased to see you.',
              'May smile during face-to-face interaction.',
            ],
          },
          {
            title:
              'Sounds and attention',
            items: [
              'May make sounds other than crying.',
              'May react to louder sounds.',
              'May watch you as you move.',
              'May look at a toy for a short time.',
            ],
          },
          {
            title:
              'Movement',
            items: [
              'May hold the head up during tummy time.',
              'May move both arms and both legs.',
              'May open the hands briefly.',
            ],
          },
        ],
      },

      {
        id: '4-months',
        title: 'Around 4 months',
        subtitle:
          'More interaction, sounds, curiosity and body control.',
        groups: [
          {
            title:
              'Connecting and playing',
            items: [
              'May smile to get your attention.',
              'May chuckle when you try to make them laugh.',
              'May look, move or make sounds to keep your attention.',
            ],
          },
          {
            title:
              'Sounds',
            items: [
              'May make cooing sounds.',
              'May make sounds back when you talk.',
              'May turn toward the sound of your voice.',
            ],
          },
          {
            title:
              'Looking and learning',
            items: [
              'May look at their hands with interest.',
              'May open their mouth when they see breast or bottle if hungry.',
            ],
          },
          {
            title:
              'Movement',
            items: [
              'May hold the head steady while being held.',
              'May hold a toy placed in the hand.',
              'May swing an arm toward toys.',
              'May bring hands to the mouth.',
              'May push up onto elbows or forearms during tummy time.',
            ],
          },
        ],
      },

      {
        id: '6-months',
        title: 'Around 6 months',
        subtitle:
          'More laughter, exploring, reaching and movement.',
        groups: [
          {
            title:
              'People and play',
            items: [
              'May recognise familiar people.',
              'May enjoy looking in a mirror.',
              'May laugh.',
            ],
          },
          {
            title:
              'Sounds',
            items: [
              'May take turns making sounds with you.',
              'May make squealing sounds.',
              'May experiment with raspberries.',
            ],
          },
          {
            title:
              'Exploring',
            items: [
              'May explore safe objects with the mouth.',
              'May reach for a toy they want.',
              'May close the lips to show they do not want more food.',
            ],
          },
          {
            title:
              'Movement',
            items: [
              'May roll from tummy to back.',
              'May push up with straight arms during tummy time.',
              'May lean on the hands for support while sitting.',
            ],
          },
        ],
      },

      {
        id: '9-months',
        title: 'Around 9 months',
        subtitle:
          'More expression, communication, play and independent sitting.',
        groups: [
          {
            title:
              'People and feelings',
            items: [
              'May be more cautious around unfamiliar people.',
              'May show several facial expressions.',
              'May look when their name is called.',
              'May react when you leave.',
              'May smile or laugh during peek-a-boo.',
            ],
          },
          {
            title:
              'Communication',
            items: [
              'May make repeated sounds such as “mamama” or “bababa”.',
              'May lift the arms to be picked up.',
            ],
          },
          {
            title:
              'Thinking and play',
            items: [
              'May look for an object that drops out of sight.',
              'May bang two objects together.',
            ],
          },
          {
            title:
              'Movement',
            items: [
              'May get into a sitting position.',
              'May sit without support.',
              'May move an object from one hand to the other.',
              'May rake small pieces of food toward themselves with the fingers.',
            ],
          },
        ],
      },

      {
        id: '12-months',
        title: 'Around 12 months',
        subtitle:
          'More intentional play, communication and movement.',
        groups: [
          {
            title:
              'Playing together',
            items: [
              'May play simple games with you, such as pat-a-cake.',
            ],
          },
          {
            title:
              'Communication',
            items: [
              'May wave goodbye.',
              'May use “mama”, “dada” or another special name for a parent.',
              'May pause or stop briefly when told “no”.',
            ],
          },
          {
            title:
              'Thinking and play',
            items: [
              'May put an object into a container.',
              'May look for an object they watched you hide.',
            ],
          },
          {
            title:
              'Movement',
            items: [
              'May pull up to stand.',
              'May move while holding onto furniture.',
              'May drink from an open cup while you hold it.',
              'May pick up small pieces using thumb and finger.',
            ],
          },
        ],
      },
    ];


  ngOnInit(): void {
    const stageId =
      this.route.snapshot.paramMap.get(
        'stage',
      );

    this.stage =
      this.stages.find(
        (
          item,
        ) =>
          item.id ===
          stageId,
      ) ||
      this.stages[0];
  }


  goBack(): void {
    void this.router.navigate(
      ['/baby/milestones'],
    );
  }
}