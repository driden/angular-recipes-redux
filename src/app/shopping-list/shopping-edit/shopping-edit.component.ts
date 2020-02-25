import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/Ingredient';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('shopForm', { static: false }) shoppingForm: NgForm;
  ingredientEditSubscription: Subscription;

  constructor(private store: Store<fromShoppingList.AppState>) {}

  ngOnInit(): void {
    this.ingredientEditSubscription = this.store
      .select('shoppingList')
      .subscribe(state => {
        if (!state.editedIngredient) {
          return;
        }

        const ingredient = state.editedIngredient;
        this.shoppingForm.setValue({
          name: ingredient.name,
          amount: ingredient.amount
        });
      });
  }

  ngOnDestroy() {
    this.ingredientEditSubscription.unsubscribe();
  }

  onAddItem(): void {
    const newIngredient = this.getFormIngredient();
    this.onClearItem();
    this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
  }

  onDeleteItem(): void {
    const newIngredient = this.getFormIngredient();
    this.store.dispatch(
      new ShoppingListActions.DeleteIngredient(newIngredient)
    );
    this.onClearItem();
  }

  onClearItem(): void {
    this.shoppingForm.reset();
  }

  private getFormIngredient(): Ingredient {
    const ingName = this.shoppingForm.controls.name.value;
    const ingAmount = +this.shoppingForm.controls.amount.value;
    return new Ingredient(ingName, ingAmount);
  }
}
