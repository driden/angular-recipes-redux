import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/Ingredient';
import { ShoppingListService } from './shopping-list.service';
import { Observable } from 'rxjs';
import * as fromShoppingList from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;
  constructor(
    private shopListSvc: ShoppingListService,
    private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit() {
    this.ingredients$ = this.store.select('shoppingList');
  }

  onIngredientClicked(clickedIngredient: Ingredient) {
    this.shopListSvc.editingIngredient.next(clickedIngredient);
  }
}
