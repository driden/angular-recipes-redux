import { Subject } from "rxjs";

import { Ingredient } from "../shared/Ingredient";

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  editingIngredient = new Subject<Ingredient>();

  private ingredients: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 2)
  ];

  getAll(): Ingredient[] {
    return this.ingredients.slice();
  }

  add(ingredient: Ingredient): void {
    const inArray = this.findIngredient(ingredient.name);

    if (inArray) {
      inArray.amount += +ingredient.amount;
    } else {
      this.ingredients.push(ingredient);
    }
    this.emitIngredientChanges();
  }

  delete(ingredient: Ingredient): void {
    const inArray = this.findIngredient(ingredient.name);

    if (inArray && inArray.amount > ingredient.amount) {
      inArray.amount -= +ingredient.amount;
    } else if (inArray) {
      this.ingredients.splice(this.ingredients.indexOf(inArray), 1);
    }
    this.emitIngredientChanges();
  }

  private findIngredient(name: string): Ingredient {
    return this.ingredients.find(
      ing => name.toLowerCase() === ing.name.toLowerCase()
    );
  }

  private emitIngredientChanges(): void {
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
