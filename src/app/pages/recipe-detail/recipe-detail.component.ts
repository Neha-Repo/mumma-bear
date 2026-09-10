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
} from '../recipes/recipe-data';

@Component({
  selector:
    'app-recipe-detail',
  standalone: true,
  imports: [],
  templateUrl:
    './recipe-detail.component.html',
  styleUrl:
    './recipe-detail.component.scss',
})
export class RecipeDetailComponent
  implements OnInit
{
  private readonly router =
    inject(Router);

  private readonly route =
    inject(ActivatedRoute);

  recipe:
    Recipe | null =
      null;


  ngOnInit(): void {
    const recipeId =
      this.route.snapshot
        .paramMap
        .get('recipeId');

    this.recipe =
      RECIPES.find(
        (recipe) =>
          recipe.id ===
          recipeId,
      ) ?? null;
  }


  goBack(): void {
    const tab =
      this.recipe?.audience ===
        'baby'
        ? 'baby'
        : 'mum';

    void this.router.navigate(
      ['/recipes'],
      {
        queryParams: {
          tab,
        },
      },
    );
  }


  goToRecipes(): void {
    void this.router.navigate(
      ['/recipes'],
    );
  }
}