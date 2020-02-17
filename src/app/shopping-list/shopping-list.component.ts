import { Component } from '@angular/core';

import { Ingredient } from '../shared/Ingredient';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent {
  constructor(private shopListSvc: ShoppingListService) {}

  onIngredientClicked(clickedIngredient: Ingredient) {
    this.shopListSvc.editingIngredient.next(clickedIngredient);
  }

  get ingredients(): Ingredient[] {
    return this.shopListSvc.getAll();
  }
}
