import { Recipe } from '../Recipe';
import * as RecipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipeReducer(
  state: State = initialState,
  action: RecipesActions.RecipesActions
) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return { ...state, recipes: [...action.payload] };
    case RecipesActions.ADD_RECIPE:
      action.payload.id = newId(state.recipes);
      return { ...state, recipes: [...state.recipes, action.payload] };
    case RecipesActions.UPDATE_RECIPE:
      const recipesCopy = [...state.recipes];
      const index = recipesCopy.findIndex(r => r.id === action.payload.id);
      if (index < 0) {
        return state;
      }
      recipesCopy[index] = action.payload.updatedRecipe;
      if (!recipesCopy[index].id) {
        recipesCopy[index].id = newId(recipesCopy);
      }
      return { ...state, recipes: recipesCopy };
    case RecipesActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(r => r.id !== action.payload)
      };
    default:
      return state;
  }
}

function newId(recipes: Recipe[]): number {
  return (
    1 +
    recipes.reduce<number>(
      (acc: number, current: Recipe) => (current.id > acc ? current.id : acc),
      0
    )
  );
}
