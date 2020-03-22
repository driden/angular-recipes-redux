import { Action } from '@ngrx/store';
import { Recipe } from '../Recipe';

export const SET_RECIPES = '[RECIPES]SET_RECIPES';
export const FETCH_RECIPES = '[RECIPES]FETCH_RECIPES';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;
}

export type RecipesActions = SetRecipes | FetchRecipes;