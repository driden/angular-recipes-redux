import { Subject } from 'rxjs';

import { Recipe } from './Recipe';
import { Ingredient } from '../shared/Ingredient';

export class RecipesService {
  recipesChanged: Subject<Recipe[]>;
  private recipes: Recipe[];

  constructor() {
    this.recipesChanged = new Subject<Recipe[]>();
    this.recipes = [];
  }

  // private recipes: Recipe[] = [
  // new Recipe(
  //   1,
  //   'Recipe1',
  //   'test recipe1',
  //   'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg',
  //   [new Ingredient('Avocado', 2), new Ingredient('Potato', 4)]
  // ),
  // new Recipe(
  //   2,
  //   'A Test Recipe',
  //   'This is just a test recipe',
  //   'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg',
  //   [new Ingredient('Meat', 1), new Ingredient('Corn', 10)]
  // )
  // ];

  getAll(): Recipe[] {
    return this.recipes.slice();
  }

  get(id: number): Recipe {
    return this.recipes.find(recipe => recipe.id === id);
  }

  add(recipe: Recipe): void {
    recipe.id = this.newId();
    this.recipes.push(recipe);
    this.recipesChanged.next(this.getAll());
  }

  update(id: number, recipe: Recipe): void {
    if (id < 0) {
      return;
    }

    recipe.id = id;

    for (let index = 0; this.recipes.length > index; index++) {
      if (this.recipes[index].id === id) {
        this.recipes[index] = recipe;
      }
    }

    this.recipesChanged.next(this.getAll());
  }

  delete(id: number): void {
    const toRemove = this.get(id);
    const index = this.recipes.indexOf(toRemove);
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.getAll());
  }

  setAll(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.getAll());
  }

  private newId(): number {
    return (
      1 +
      this.recipes.reduce<number>(
        (acc: number, current: Recipe) => (current.id > acc ? current.id : acc),
        0
      )
    );
  }
}
