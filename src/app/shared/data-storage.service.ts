import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

import { RecipesService } from '../recipes/recipes.service';
import { Recipe } from '../recipes/Recipe';
import * as fromAspp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesServices: RecipesService,
    private _store: Store<fromAspp.AppState>
  ) {}

  store() {
    const recipes = this.recipesServices.getAll();
    this.http
      .put('https://angular-recipes-94d9d.firebaseio.com/recipes.json', recipes)
      .subscribe(console.log);
  }

  fetch() {
    return this.http
      .get<Recipe[]>(
        'https://angular-recipes-94d9d.firebaseio.com/recipes.json'
      )
      .pipe(
        map(recipes =>
          recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          })
        ),
        tap(recipes => {
          // this.recipesServices.setAll(recipes)
          this._store.dispatch(new RecipesActions.SetRecipes(recipes));
        })
      );
  }
}
