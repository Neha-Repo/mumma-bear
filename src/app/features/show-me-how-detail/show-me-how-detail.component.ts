import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

interface GuideStep {
  title: string;
  text: string;
}

interface GuideDetail {
  id: string;
  title: string;
  category: string;
  intro: string;
  image: string;
  imageAlt: string;
  steps: GuideStep[];
  noteTitle: string;
  note: string;
}

@Component({
  selector:
    'app-show-me-how-detail',
  standalone: true,
  imports: [],
  templateUrl:
    './show-me-how-detail.component.html',
  styleUrl:
    './show-me-how-detail.component.scss',
})
export class ShowMeHowDetailComponent
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

  guide:
    GuideDetail | null =
      null;

  private readonly guides:
    GuideDetail[] = [
      {
        id: 'burping',
        title: 'Burping baby',
        category: 'Feeding',
        intro:
          'Try a comfortable position and give baby a little time.',
        image:
          'assets/images/burping.webp',
        imageAlt:
          'Parent holding baby upright while burping them.',
        steps: [
          {
            title: 'Choose a position',
            text:
              'Hold baby upright against your chest or sit them supported on your lap.',
          },
          {
            title: 'Support gently',
            text:
              'Keep baby’s head and neck comfortably supported.',
          },
          {
            title: 'Pat or rub',
            text:
              'Use gentle pats or slow upward rubs on baby’s back.',
          },
          {
            title: 'Give it a moment',
            text:
              'Not every feed ends with a burp. If baby seems comfortable, you do not need to keep trying.',
          },
        ],
        noteTitle:
          'Good to know',
        note:
          'Keep a cloth nearby for small amounts of milk that may come back up.',
      },

      {
        id: 'swaddling',
        title: 'Swaddling',
        category: 'Baby basics',
        intro:
          'Keep the wrap snug around the upper body while leaving room for the hips and legs.',
        image:
          'assets/images/swaddling.webp',
        imageAlt:
          'Baby wrapped comfortably in a swaddle.',
        steps: [
          {
            title: 'Lay the wrap flat',
            text:
              'Fold the top corner down slightly and place baby on their back.',
          },
          {
            title: 'Wrap one side',
            text:
              'Bring one side across baby’s body and tuck it securely underneath.',
          },
          {
            title: 'Bring the bottom up',
            text:
              'Fold the lower section upward without tightly straightening baby’s legs.',
          },
          {
            title: 'Finish the other side',
            text:
              'Bring the remaining side across and tuck it in so the wrap stays secure.',
          },
        ],
        noteTitle:
          'Sleep safety',
        note:
          'Always place baby on their back for sleep. Stop swaddling when baby shows signs of trying to roll.',
      },

      {
        id: 'cord-care',
        title: 'Cord care',
        category: 'Baby basics',
        intro:
          'The main job is to keep the cord stump clean, dry and undisturbed.',
        image:
          'assets/images/cord-care.webp',
        imageAlt:
          'Close view of a newborn baby’s healing umbilical cord stump.',
        steps: [
          {
            title: 'Keep it dry',
            text:
              'Let air reach the stump whenever practical.',
          },
          {
            title: 'Fold the diaper down',
            text:
              'Keep the top of the diaper from rubbing or covering the stump.',
          },
          {
            title: 'Clean only if needed',
            text:
              'If it becomes soiled, gently clean around it and allow it to dry.',
          },
          {
            title: 'Let it come away naturally',
            text:
              'Do not pull the stump off, even when it looks almost ready.',
          },
        ],
        noteTitle:
          'Get advice if concerned',
        note:
          'If the skin around the cord becomes increasingly red, swollen, has pus, or baby seems unwell, contact a healthcare professional.',
      },

      {
        id: 'diaper-change',
        title: 'Changing a diaper',
        category: 'Baby basics',
        intro:
          'Set everything within reach first so one hand can stay with baby.',
        image:
          'assets/images/diaper-change.webp',
        imageAlt:
          'Baby lying safely on a changing surface during a diaper change.',
        steps: [
          {
            title: 'Prepare first',
            text:
              'Have a clean diaper, wipes or water, and anything else you need beside you.',
          },
          {
            title: 'Remove the dirty diaper',
            text:
              'Open it carefully and use the cleaner part of the diaper for the first wipe if useful.',
          },
          {
            title: 'Clean gently',
            text:
              'Clean the diaper area carefully and allow the skin to dry.',
          },
          {
            title: 'Fit the clean diaper',
            text:
              'Slide it underneath, fasten comfortably and check that clothing is not trapped inside.',
          },
        ],
        noteTitle:
          'One-hand rule',
        note:
          'On a raised changing surface, keep one hand on baby whenever you reach for something.',
      },

      {
        id: 'bathing',
        title: 'Bathing baby',
        category: 'Baby basics',
        intro:
          'A calm bath starts by having everything ready before baby goes near the water.',
        image:
          'assets/images/bathing.webp',
        imageAlt:
          'Baby being gently washed in a small baby bath.',
        steps: [
          {
            title: 'Set up first',
            text:
              'Place the towel, clean diaper, clothes and washing items within reach.',
          },
          {
            title: 'Check the water',
            text:
              'Use comfortably warm water and check it before placing baby in the bath.',
          },
          {
            title: 'Support baby',
            text:
              'Keep a secure hand supporting baby’s head and upper body.',
          },
          {
            title: 'Wash simply',
            text:
              'Gently wash from cleaner areas toward the diaper area, then lift baby straight into the towel.',
          },
        ],
        noteTitle:
          'Stay within reach',
        note:
          'Never leave baby alone in or near bath water, even for a moment.',
      },

      {
        id: 'safe-sleep',
        title: 'Safe sleep setup',
        category: 'Sleep',
        intro:
          'Keep the sleep space simple.',
        image:
          'assets/images/safe-sleep.webp',
        imageAlt:
          'Baby lying on their back in a clear sleep space.',
        steps: [
          {
            title: 'Place baby on their back',
            text:
              'Start every sleep with baby lying on their back.',
          },
          {
            title: 'Use a firm flat surface',
            text:
              'Use a suitable firm, flat sleep surface designed for a baby.',
          },
          {
            title: 'Keep the space clear',
            text:
              'Keep pillows, loose bedding, toys and other soft objects out of the sleep area.',
          },
          {
            title: 'Keep baby nearby',
            text:
              'For young babies, a separate sleep surface in the same room makes night care easier.',
          },
        ],
        noteTitle:
          'Keep it simple',
        note:
          'A clear, firm, flat sleep space is easier to check quickly when you are tired.',
      },

      {
        id: 'tummy-time',
        title: 'Tummy time',
        category: 'Development',
        intro:
          'Small moments count. Tummy time does not need to become another task to complete.',
        image:
          'assets/images/tummy-time.webp',
        imageAlt:
          'Awake baby practising tummy time while supervised.',
        steps: [
          {
            title: 'Choose an awake moment',
            text:
              'Try when baby is alert and comfortable.',
          },
          {
            title: 'Start small',
            text:
              'Place baby tummy-down for a short period while you stay close.',
          },
          {
            title: 'Come down to baby’s level',
            text:
              'Use your face or voice to make the position more interesting.',
          },
          {
            title: 'Try another way',
            text:
              'If the floor is difficult, tummy time on your chest while you are awake and supervising can feel gentler.',
          },
        ],
        noteTitle:
          'No score',
        note:
          'Short attempts throughout the day can be easier than trying to reach one long session.',
      },

      {
        id: 'bottle-feeding',
        title: 'Bottle feeding',
        category: 'Feeding',
        intro:
          'Keep baby supported and let the feed move at a comfortable pace.',
        image:
          'assets/images/bottle-feeding.webp',
        imageAlt:
          'Parent comfortably holding and bottle feeding baby.',
        steps: [
          {
            title: 'Hold baby comfortably',
            text:
              'Support baby in a slightly upright position with the head and neck supported.',
          },
          {
            title: 'Offer the bottle',
            text:
              'Touch the teat gently near baby’s mouth and let baby accept it.',
          },
          {
            title: 'Follow baby’s pace',
            text:
              'Allow pauses and watch baby’s feeding cues rather than trying to finish a set amount.',
          },
          {
            title: 'Pause when needed',
            text:
              'Take a short break if baby turns away, slows down or seems uncomfortable.',
          },
        ],
        noteTitle:
          'Follow baby',
        note:
          'Baby may take different amounts at different feeds. Feeding cues are more useful than pressure to empty the bottle.',
      },

      {
        id: 'pump-assembly',
        title: 'Pump setup',
        category: 'Pumping',
        intro:
          'Most pump setups are easier when you build them in the same order every time.',
        image:
          'assets/images/pump-setup.webp',
        imageAlt:
          'Breast pump with bottle and pump parts arranged ready for use.',
        steps: [
          {
            title: 'Start with clean parts',
            text:
              'Place the pump parts you need on a clean surface.',
          },
          {
            title: 'Build the milk path',
            text:
              'Connect the flange, connector, valve or membrane and bottle according to your pump model.',
          },
          {
            title: 'Connect the pump',
            text:
              'Attach tubing or the motor section if your pump uses them.',
          },
          {
            title: 'Check the seal',
            text:
              'Before pumping, make sure the parts are fully connected and sitting correctly.',
          },
        ],
        noteTitle:
          'Pump models differ',
        note:
          'Use your pump manufacturer’s instructions for the exact assembly, cleaning and sanitizing requirements.',
      },

      {
        id: 'starting-solids',
        title: 'Starting solids',
        category: 'Feeding',
        intro:
          'Keep first tastes simple, calm and supervised.',
        image:
          'assets/images/starting-solids.webp',
        imageAlt:
          'Baby sitting upright and being offered a small spoonful of soft food.',
        steps: [
          {
            title: 'Sit baby upright',
            text:
              'Use a secure supported seated position suitable for feeding.',
          },
          {
            title: 'Start simply',
            text:
              'Offer a small amount of an appropriate soft texture.',
          },
          {
            title: 'Let baby explore',
            text:
              'Give baby time to look, touch, smell and taste without pressure.',
          },
          {
            title: 'Stop when baby is done',
            text:
              'Follow baby’s cues rather than trying to reach a particular amount.',
          },
        ],
        noteTitle:
          'Timing varies',
        note:
          'Readiness for solids is individual. Discuss timing with baby’s healthcare professional if you are unsure.',
      },

      {
        id: 'cup-introduction',
        title: 'Introducing a cup',
        category: 'Feeding',
        intro:
          'A tiny amount and plenty of support is enough for early practice.',
        image:
          'assets/images/cup-introduction.webp',
        imageAlt:
          'Baby practising drinking from a small training cup.',
        steps: [
          {
            title: 'Choose a small cup',
            text:
              'A small open cup can be easier for you to control.',
          },
          {
            title: 'Support it',
            text:
              'Hold the cup and bring it gently to baby’s lips.',
          },
          {
            title: 'Tip slightly',
            text:
              'Allow a very small amount to reach the lips rather than pouring into the mouth.',
          },
          {
            title: 'Keep it relaxed',
            text:
              'Early cup use is practice, so spills and very small sips are normal.',
          },
        ],
        noteTitle:
          'Stay with baby',
        note:
          'Keep baby upright and closely supervised whenever they are drinking.',
      },

      {
        id: 'baby-proofing',
        title: 'Baby-proofing basics',
        category: 'Home',
        intro:
          'Look at the room from the level your increasingly mobile baby can reach.',
        image:
          'assets/images/baby-proofing.webp',
        imageAlt:
          'Mobile baby exploring a room while household hazards are being considered.',
        steps: [
          {
            title: 'Start low',
            text:
              'Get down near floor level and look for objects baby could reach, pull or put in the mouth.',
          },
          {
            title: 'Secure unstable items',
            text:
              'Check furniture, screens and objects that could tip or fall.',
          },
          {
            title: 'Move hazards',
            text:
              'Keep medicines, cleaning products, cords and small objects securely out of reach.',
          },
          {
            title: 'Recheck as baby changes',
            text:
              'A room that was safe last month may need another look once baby can reach higher or move faster.',
          },
        ],
        noteTitle:
          'Think one stage ahead',
        note:
          'Making small changes before baby reaches a new area is easier than trying to change the whole home at once.',
      },
    ];


  ngOnInit(): void {
    const guideId =
      this.route.snapshot.paramMap.get(
        'guideId',
      );

    this.guide =
      this.guides.find(
        (
          guide,
        ) =>
          guide.id ===
          guideId,
      ) ||
      this.guides[0];
  }


  goBack(): void {
    void this.router.navigate(
      ['/show-me-how'],
    );
  }
}