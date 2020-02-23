import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Recipe } from '../Recipe';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../shared/Ingredient';
import { RecipesService } from '../recipes.service';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  @Output() onAddToShoppingList: EventEmitter<Ingredient[]> = new EventEmitter<
    Ingredient[]
  >();

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((recipeId: Params) => {
      const id = +recipeId.id;
      this.recipe = this.recipeService.get(id);
    });
  }

  addIngredients(): void {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.recipeService.delete(this.recipe.id);
    this.router.navigate(['/recipes']);
  }
}
