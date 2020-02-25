import { Ingredient } from '../../shared/Ingredient';
import * as ShoppingListActions from './shopping-list.actions';

export interface AppState {
  shoppingList: State;
}

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
      return addIngredientToShoppingList(action.payload as Ingredient, state);
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
      return { ...state, editedIngredient: action.payload };
    default:
      return state;
  }
}

function addIngredientToShoppingList(
  ingredient: Ingredient,
  state: State
): State {
  const newState: State = { ...state };
  let stored = false;
  newState.ingredients.map(i => {
    if (i.name.toLocaleLowerCase() === ingredient.name.toLocaleLowerCase()) {
      i.amount += ingredient.amount;
      stored = true;
    }
  });
  if (!stored) {
    newState.ingredients.push(ingredient);
  }
  return newState;
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
