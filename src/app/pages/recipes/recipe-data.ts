export type RecipeAudience =
  | 'mum'
  | 'baby';

export interface Recipe {
  id: string;
  audience: RecipeAudience;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  time: string;
  ingredients: string[];
  steps: string[];
  minDays?: number;
  safetyNote?: string;
}

export const RECIPES:
  Recipe[] = [

  {
    id: 'mum-eggs-avocado',
    audience: 'mum',
    title: 'Eggs with avocado',
    description:
      'A quick warm breakfast with eggs, avocado and tomatoes.',
    image:
      'assets/images/recipes/mum-breakfast-eggs-avocado.webp',
    imageAlt:
      'Eggs with avocado and tomatoes',
    time: '10 min',
    ingredients: [
      '2 eggs',
      '1/2 avocado',
      'A handful of cherry tomatoes',
      '1 slice of toast',
      'A little olive oil or butter',
    ],
    steps: [
      'Cook the eggs the way you like them.',
      'Toast the bread while the eggs cook.',
      'Slice or mash the avocado.',
      'Serve with the tomatoes alongside.',
    ],
  },

  {
    id: 'mum-smoothie-bowl',
    audience: 'mum',
    title: 'Berry banana smoothie bowl',
    description:
      'A fast fruit and yogurt bowl for mornings when cooking feels like too much.',
    image:
      'assets/images/recipes/mum-breakfast-smoothie-bowl.webp',
    imageAlt:
      'Berry and banana smoothie bowl',
    time: '5 min',
    ingredients: [
      '1 banana',
      '1 handful frozen berries',
      '3 tablespoons yogurt',
      'A splash of milk',
      '2 tablespoons oats',
    ],
    steps: [
      'Blend the banana, berries, yogurt and milk.',
      'Pour into a bowl.',
      'Scatter the oats over the top.',
    ],
  },

  {
    id: 'mum-overnight-oats',
    audience: 'mum',
    title: 'Banana overnight oats',
    description:
      'Prepare it ahead, then breakfast is ready when you are.',
    image:
      'assets/images/recipes/mum-breakfast-overnight-oats.webp',
    imageAlt:
      'Overnight oats with banana and blueberries',
    time: '5 min prep',
    ingredients: [
      '1/2 cup oats',
      '1/2 cup milk',
      '2 tablespoons yogurt',
      '1/2 banana',
      'A small handful of blueberries',
    ],
    steps: [
      'Mix the oats, milk and yogurt in a container.',
      'Slice the banana over the top.',
      'Add the blueberries.',
      'Cover and refrigerate overnight.',
    ],
  },

  {
    id: 'mum-quinoa-salad',
    audience: 'mum',
    title: 'Quick quinoa salad',
    description:
      'A simple bowl using ready-cooked quinoa, chickpeas and fresh vegetables.',
    image:
      'assets/images/recipes/mum-lunch-quinoa-salad.webp',
    imageAlt:
      'Quinoa chickpea and vegetable salad',
    time: '10 min',
    ingredients: [
      '1 cup ready-cooked quinoa',
      '1/2 cup chickpeas',
      'Chopped cucumber',
      'Chopped tomato',
      'A handful of leafy greens',
      'Olive oil and lemon',
    ],
    steps: [
      'Add the quinoa and chickpeas to a bowl.',
      'Add the cucumber, tomato and greens.',
      'Drizzle with olive oil and lemon.',
      'Mix and eat straight away.',
    ],
  },

  {
    id: 'mum-chicken-wrap',
    audience: 'mum',
    title: 'Chicken vegetable wrap',
    description:
      'An easy handheld lunch made with cooked chicken and crunchy vegetables.',
    image:
      'assets/images/recipes/mum-lunch-chicken-wrap.webp',
    imageAlt:
      'Chicken and vegetable wrap',
    time: '10 min',
    ingredients: [
      '1 large wrap',
      'Cooked chicken',
      'A handful of lettuce',
      'Sliced cucumber',
      'Sliced tomato',
      'A spoonful of yogurt or hummus',
    ],
    steps: [
      'Lay the wrap flat.',
      'Spread the yogurt or hummus over it.',
      'Add the chicken and vegetables.',
      'Roll firmly and cut in half.',
    ],
  },

  {
    id: 'mum-veg-stirfry',
    audience: 'mum',
    title: 'Fast vegetable stir-fry',
    description:
      'A warm one-pan dinner using vegetables and quick-cook noodles.',
    image:
      'assets/images/recipes/mum-dinner-veg-stirfry.webp',
    imageAlt:
      'Vegetable stir-fry',
    time: '10 min',
    ingredients: [
      '1 pack quick-cook noodles',
      '2 handfuls mixed vegetables',
      '1 teaspoon cooking oil',
      '1 tablespoon soy sauce',
      'Optional cooked chicken or tofu',
    ],
    steps: [
      'Cook the noodles according to the packet.',
      'Stir-fry the vegetables in a hot pan.',
      'Add chicken or tofu if using.',
      'Add the noodles and soy sauce and toss together.',
    ],
  },

  {
    id: 'mum-salmon',
    audience: 'mum',
    title: 'Simple salmon plate',
    description:
      'Salmon with vegetables and potatoes for a straightforward warm meal.',
    image:
      'assets/images/recipes/mum-dinner-salmon.webp',
    imageAlt:
      'Salmon with vegetables and potatoes',
    time: '20 min',
    ingredients: [
      '1 salmon fillet',
      'A handful of baby potatoes',
      '1 cup vegetables',
      'A little olive oil',
      'Lemon',
    ],
    steps: [
      'Cook the potatoes until tender.',
      'Cook the salmon until fully cooked through.',
      'Steam or microwave the vegetables.',
      'Serve together with a squeeze of lemon.',
    ],
  },

  {
    id: 'mum-pesto-pasta',
    audience: 'mum',
    title: 'Quick pesto pasta',
    description:
      'A low-effort pasta dinner with pesto and tomatoes.',
    image:
      'assets/images/recipes/mum-dinner-pesto-pasta.webp',
    imageAlt:
      'Pesto pasta with tomatoes',
    time: '15 min',
    ingredients: [
      '1 serving pasta',
      '1 tablespoon pesto',
      'A handful of cherry tomatoes',
      'A little grated cheese',
    ],
    steps: [
      'Cook the pasta until tender.',
      'Drain and return it to the pan.',
      'Stir through the pesto.',
      'Add the tomatoes and grated cheese.',
    ],
  },

  {
    id: 'mum-energy-balls',
    audience: 'mum',
    title: 'No-bake oat bites',
    description:
      'Make-ahead oat bites that are easy to grab with one hand.',
    image:
      'assets/images/recipes/mum-snack-energy-balls.webp',
    imageAlt:
      'No bake oat bites',
    time: '10 min prep',
    ingredients: [
      '1 cup oats',
      '1/2 cup nut or seed butter',
      '2 tablespoons honey or maple syrup',
      '2 tablespoons raisins',
    ],
    steps: [
      'Mix everything together in a bowl.',
      'Roll into small balls.',
      'Chill until firm.',
      'Keep refrigerated for an easy snack.',
    ],
  },

  {
    id: 'mum-yogurt-berries',
    audience: 'mum',
    title: 'Yogurt and berries',
    description:
      'A five-minute snack when you need something without preparing a meal.',
    image:
      'assets/images/recipes/mum-snack-yogurt.webp',
    imageAlt:
      'Yogurt with berries and oat topping',
    time: '5 min',
    ingredients: [
      '1 bowl of yogurt',
      'A handful of berries',
      '2 tablespoons oats or granola',
      'Optional sliced banana',
    ],
    steps: [
      'Spoon the yogurt into a bowl.',
      'Add the berries.',
      'Top with oats or granola.',
      'Add banana if you want something more filling.',
    ],
  },


  {
    id: 'baby-carrot-puree',
    audience: 'baby',
    title: 'Smooth carrot puree',
    description:
      'A simple smooth carrot idea for the early solids stage.',
    image:
      'assets/images/recipes/baby-puree-carrot.webp',
    imageAlt:
      'Smooth carrot puree for baby',
    time: 'Simple prep',
    minDays: 150,
    ingredients: [
      '1 carrot',
      'A little water',
    ],
    steps: [
      'Peel and chop the carrot.',
      'Steam or boil until very soft.',
      'Blend until smooth.',
      'Thin with a little water if needed.',
    ],
    safetyNote:
      'Offer only when your baby is ready for solids. Serve an appropriate texture and supervise while eating.',
  },

  {
    id: 'baby-pea-puree',
    audience: 'baby',
    title: 'Smooth pea puree',
    description:
      'Soft blended peas with a smooth texture.',
    image:
      'assets/images/recipes/baby-puree-peas.webp',
    imageAlt:
      'Smooth pea puree for baby',
    time: 'Simple prep',
    minDays: 150,
    ingredients: [
      '1/2 cup peas',
      'A little water',
    ],
    steps: [
      'Cook the peas until very soft.',
      'Blend thoroughly.',
      'Add a little water to loosen the texture if needed.',
      'Allow to cool before serving.',
    ],
    safetyNote:
      'Offer only when your baby is ready for solids. Serve an appropriate texture and supervise while eating.',
  },

  {
    id: 'baby-banana-oats',
    audience: 'baby',
    title: 'Banana oat puree',
    description:
      'Soft banana mixed with smooth cooked oats.',
    image:
      'assets/images/recipes/baby-puree-banana-oats.webp',
    imageAlt:
      'Banana and oat puree for baby',
    time: '10 min',
    minDays: 150,
    ingredients: [
      '2 tablespoons oats',
      'Water or usual milk for cooking',
      '1/2 ripe banana',
    ],
    steps: [
      'Cook the oats until very soft.',
      'Mash the banana until smooth.',
      'Mix the banana into the oats.',
      'Adjust the texture if needed before serving.',
    ],
    safetyNote:
      'Offer only when your baby is ready for solids. Serve an appropriate texture and supervise while eating.',
  },

  {
    id: 'baby-avocado',
    audience: 'baby',
    title: 'Soft mashed avocado',
    description:
      'A very simple no-cook food idea for the solids stage.',
    image:
      'assets/images/recipes/baby-solids-avocado.webp',
    imageAlt:
      'Soft mashed avocado for baby',
    time: '2 min',
    minDays: 150,
    ingredients: [
      '1/4 ripe avocado',
    ],
    steps: [
      'Scoop the avocado into a bowl.',
      'Mash thoroughly with a fork.',
      'Adjust the texture to suit your baby.',
      'Serve straight away.',
    ],
    safetyNote:
      'Offer only when your baby is ready for solids. Serve an appropriate texture and supervise while eating.',
  },

  {
    id: 'baby-apple-puree',
    audience: 'baby',
    title: 'Soft apple puree',
    description:
      'Cooked apple blended into a smooth simple puree.',
    image:
      'assets/images/recipes/baby-puree-apple.webp',
    imageAlt:
      'Smooth apple puree for baby',
    time: '15 min',
    minDays: 150,
    ingredients: [
      '1 apple',
      'A little water',
    ],
    steps: [
      'Peel, core and chop the apple.',
      'Cook until completely soft.',
      'Blend until smooth.',
      'Cool before serving.',
    ],
    safetyNote:
      'Offer only when your baby is ready for solids. Serve an appropriate texture and supervise while eating.',
  },

  {
    id: 'baby-blueberry-porridge',
    audience: 'baby',
    title: 'Blueberry porridge',
    description:
      'Soft porridge with cooked blueberries mixed through.',
    image:
      'assets/images/recipes/baby-porridge-blueberry.webp',
    imageAlt:
      'Soft blueberry porridge for baby',
    time: '10 min',
    minDays: 170,
    ingredients: [
      '2 tablespoons oats',
      'Water or usual milk for cooking',
      'A few blueberries',
    ],
    steps: [
      'Cook the oats until very soft.',
      'Cook the blueberries until softened.',
      'Mash the berries thoroughly.',
      'Mix through the porridge and cool before serving.',
    ],
    safetyNote:
      'Adjust the texture for your baby and supervise while eating.',
  },

  {
    id: 'baby-lentil-mash',
    audience: 'baby',
    title: 'Lentil vegetable mash',
    description:
      'Soft lentils and vegetables mashed together for a thicker texture.',
    image:
      'assets/images/recipes/baby-solids-lentil-mash.webp',
    imageAlt:
      'Soft lentil and vegetable mash for baby',
    time: '20 min',
    minDays: 180,
    ingredients: [
      '2 tablespoons red lentils',
      'A small piece of carrot',
      'A small piece of potato',
      'Water',
    ],
    steps: [
      'Rinse the lentils.',
      'Cook the lentils and vegetables together until completely soft.',
      'Mash thoroughly.',
      'Add cooking water until you have the texture you want.',
    ],
    safetyNote:
      'Adjust the texture for your baby and supervise while eating.',
  },

  {
    id: 'baby-pancakes',
    audience: 'baby',
    title: 'Soft mini pancakes',
    description:
      'Small soft pancakes that can be adapted as baby becomes comfortable with more texture.',
    image:
      'assets/images/recipes/baby-solids-pancakes.webp',
    imageAlt:
      'Soft mini pancakes with fruit for baby',
    time: '15 min',
    minDays: 210,
    ingredients: [
      '1 ripe banana',
      '1 egg',
      '2 tablespoons oats',
    ],
    steps: [
      'Mash the banana thoroughly.',
      'Mix in the egg and oats.',
      'Cook small pancakes in a non-stick pan until fully cooked.',
      'Cool and serve in an appropriate size and texture.',
    ],
    safetyNote:
      'Egg is a common allergen. Follow your health professional’s guidance on introducing allergens and supervise while eating.',
  },

  {
    id: 'baby-veg-fritters',
    audience: 'baby',
    title: 'Soft vegetable fritters',
    description:
      'Soft little vegetable fritters for babies progressing with finger foods.',
    image:
      'assets/images/recipes/baby-solids-fritters.webp',
    imageAlt:
      'Soft vegetable fritters for baby',
    time: '20 min',
    minDays: 210,
    ingredients: [
      '1/2 small courgette',
      '1 small carrot',
      '1 egg',
      '2 tablespoons flour',
    ],
    steps: [
      'Finely grate the vegetables.',
      'Mix with the egg and flour.',
      'Cook small fritters until fully cooked and soft.',
      'Cool before serving in an appropriate size.',
    ],
    safetyNote:
      'Egg is a common allergen. Follow your health professional’s guidance on introducing allergens and supervise while eating.',
  },

  {
    id: 'baby-blueberry-muffins',
    audience: 'baby',
    title: 'Soft blueberry mini muffins',
    description:
      'Small soft muffins for later in the first-year solids journey.',
    image:
      'assets/images/recipes/baby-solids-muffins.webp',
    imageAlt:
      'Small soft blueberry muffins for baby',
    time: '25 min',
    minDays: 240,
    ingredients: [
      '1 ripe banana',
      '1 egg',
      '1/2 cup oats',
      'A small handful of blueberries',
    ],
    steps: [
      'Mash the banana.',
      'Mix in the egg and oats.',
      'Fold in softened blueberries.',
      'Bake in a mini muffin tray until fully cooked, then cool.',
    ],
    safetyNote:
      'Serve in a size and texture appropriate for your baby and supervise while eating.',
  },

];