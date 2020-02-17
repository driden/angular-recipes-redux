import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/Ingredient';
import { ShoppingListService } from './shopping-list.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients$: Observable<{ ingredients: Ingredient[] }>;
  constructor(
    private shopListSvc: ShoppingListService,
    private store: Store<{
      shoppingList: {
        ingredients: Ingredient[];
      };
    }>
  ) {}

  ngOnInit() {
    this.ingredients$ = this.store.select('shoppingList');
  }

  onIngredientClicked(clickedIngredient: Ingredient) {
    this.shopListSvc.editingIngredient.next(clickedIngredient);
  }

  // get ingredients(): Ingredient[] {
  //   return this.shopListSvc.getAll();
  // }
}
