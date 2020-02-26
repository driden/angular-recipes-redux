import { Ingredient } from '../../shared/Ingredient';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null
};

export function shoppingListReducer(
  state = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      const ingredients = addIngredientToList(action.payload as Ingredient, [
        ...state.ingredients
      ]);
      return { ...state, ingredients, editedIngredient: null };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...(action.payload as Ingredient[])]
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      const newState = { ...state };
      newState.ingredients = deleteIngredient(
        action.payload as Ingredient,
        newState.ingredients
      );
      return newState;
    case ShoppingListActions.EDIT_INGREDIENT:
      return { ...state, editedIngredient: action.payload as Ingredient };
    default:
      return state;
  }
}

function addIngredientToList(
  ingredient: Ingredient,
  ingredients: Ingredient[]
): Ingredient[] {
  let stored = false;
  ingredients.map(i => {
    if (i.name.toLocaleLowerCase() === ingredient.name.toLocaleLowerCase()) {
      i.amount += ingredient.amount;
      stored = true;
    }
  });
  if (!stored) {
    ingredients.push(ingredient);
  }
  return ingredients;
}

function deleteIngredient(
  ingredient: Ingredient,
  ingredients: Ingredient[]
): Ingredient[] {
  const inArray: Ingredient = findIngredient(ingredient.name, ingredients);

  if (inArray && inArray.amount > ingredient.amount) {
    inArray.amount -= +ingredient.amount;
  } else if (inArray) {
    ingredients.splice(ingredients.indexOf(inArray), 1);
  }
  return ingredients;
}

function findIngredient(name: string, ingredients: Ingredient[]): Ingredient {
  return ingredients.find(ing => name.toLowerCase() === ing.name.toLowerCase());
}
