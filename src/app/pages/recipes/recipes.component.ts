import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  RECIPES,
  Recipe,
  RecipeAudience,
} from './recipe-data';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [],
  templateUrl:
    './recipes.component.html',
  styleUrl:
    './recipes.component.scss',
})
export class RecipesComponent
  implements OnInit
{
  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  activeTab:
    RecipeAudience =
      'mum';

  babyName =
    localStorage.getItem(
      'mumma-bear:baby-name',
    ) || 'Baby';

  babyAgeDays:
    number | null =
      null;


  ngOnInit(): void {
    this.babyAgeDays =
      this.getBabyAgeInDays();

    const requestedTab =
      this.route.snapshot
        .queryParamMap
        .get('tab');

    if (
      requestedTab ===
        'baby' ||
      requestedTab ===
        'mum'
    ) {
      this.activeTab =
        requestedTab;
    }
  }


  get quickMumRecipes():
    Recipe[] {
    return RECIPES
      .filter(
        (recipe) =>
          recipe.audience ===
            'mum' &&
          (
            recipe.time ===
              '5 min' ||
            recipe.time ===
              '10 min'
          ),
      )
      .slice(
        0,
        6,
      );
  }


  get moreMumRecipes():
    Recipe[] {
    const quickIds =
      new Set(
        this.quickMumRecipes.map(
          (recipe) =>
            recipe.id,
        ),
      );

    return RECIPES.filter(
      (recipe) =>
        recipe.audience ===
          'mum' &&
        !quickIds.has(
          recipe.id,
        ),
    );
  }


  get babyRecipesReady():
    boolean {
    return (
      this.babyAgeDays !==
        null &&
      this.babyAgeDays >=
        150
    );
  }


  get babyRecipes():
    Recipe[] {
    if (
      this.babyAgeDays ===
      null
    ) {
      return [];
    }

    return RECIPES.filter(
      (recipe) =>
        recipe.audience ===
          'baby' &&
        (
          recipe.minDays ===
            undefined ||
          this.babyAgeDays! >=
            recipe.minDays
        ),
    );
  }


  selectTab(
    tab: RecipeAudience,
  ): void {
    this.activeTab =
      tab;

    void this.router.navigate(
      [],
      {
        relativeTo:
          this.route,

        queryParams: {
          tab,
        },

        replaceUrl:
          true,
      },
    );
  }


  openRecipe(
    recipe: Recipe,
  ): void {
    void this.router.navigate(
      [
        '/recipes',
        recipe.id,
      ],
    );
  }


  goBack(): void {
    if (
      this.activeTab ===
      'baby'
    ) {
      void this.router.navigate(
        ['/baby'],
      );

      return;
    }

    void this.router.navigate(
      ['/me'],
    );
  }


  private getBabyAgeInDays():
    number | null {
    const dobValue =
      localStorage.getItem(
        'mumma-bear:baby-dob',
      );

    if (!dobValue) {
      return null;
    }

    const dob =
      new Date(
        `${dobValue}T00:00:00`,
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
}