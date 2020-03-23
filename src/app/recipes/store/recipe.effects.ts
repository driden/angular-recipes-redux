import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../Recipe';

@Injectable()
export class RecipeEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

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

  @Effect({ dispatch: false })
  deleteRecipes = this.actions$.pipe(
    ofType(RecipeActions.DELETE_RECIPE),
    tap(() => this.router.navigate(['/recipes']))
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.STORE_RECIPES),
    withLatestFrom(this.store.select(_ => _.recipes)),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        'https://angular-recipes-94d9d.firebaseio.com/recipes.json',
        recipesState.recipes
      );
    })
  );
}
