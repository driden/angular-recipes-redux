import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import { Recipe } from '../Recipe';
import { Ingredient } from '../../shared/Ingredient';
import { RecipesService } from '../recipes.service';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  @Output() onAddToShoppingList: EventEmitter<Ingredient[]> = new EventEmitter<
    Ingredient[]
  >();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((recipeId: Params) => +recipeId.id),
        switchMap(id => {
          this.id = id;
          return this.store.select(_ => _.recipes);
        }),
        map(
          recipeState =>
            recipeState.recipes.filter(recipe => recipe.id === this.id)[0]
        )
      )
      .subscribe(recipe => (this.recipe = recipe));
  }

  addIngredients(): void {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.recipe.id));
    // TODO: Esto deberia ser un effect
    // this.router.navigate(['/recipes']);
  }
}
