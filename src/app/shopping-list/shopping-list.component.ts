import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Ingredient } from '../shared/Ingredient';
import { EditIngredient } from './store/shopping-list.actions';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.ingredients$ = this.store.select('shoppingList');
  }

  onIngredientClicked(clickedIngredient: Ingredient) {
    this.store.dispatch(new EditIngredient(clickedIngredient));
  }
}
