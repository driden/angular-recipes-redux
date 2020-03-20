import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as RecipeActions from './recipe.actions';
import { Recipe } from '../Recipe';

@Injectable()
export class RecipeEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap(() =>
      this.http.get<Recipe[]>(
        'https://angular-recipes-94d9d.firebaseio.com/recipes.json'
      )
    ),
    map(recipes =>
      recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      })
    ),
    map(recipes => new RecipeActions.SetRecipes(recipes))
  );
}
