import { Component, ViewChild, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";

import { Ingredient } from "src/app/shared/Ingredient";
import { ShoppingListService } from "../shopping-list.service";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"]
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("shopForm", { static: false }) shoppingForm: NgForm;
  ingredientEditSubscription: Subscription;

  constructor(private shpSvc: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredientEditSubscription = this.shpSvc.editingIngredient.subscribe(
      ingredient => {
        this.shoppingForm.setValue({
          name: ingredient.name,
          amount: ingredient.amount
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.ingredientEditSubscription.unsubscribe();
  }

  onAddItem(): void {
    const newIngredient = this.getFormIngredient();
    this.shpSvc.add(newIngredient);
    this.onClearItem();
  }

  onDeleteItem(): void {
    const newIngredient = this.getFormIngredient();
    this.shpSvc.delete(newIngredient);
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
