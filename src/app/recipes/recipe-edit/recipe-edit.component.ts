import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormArray,
  AbstractControl,
  Validators
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { Recipe } from '../Recipe';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode: boolean;
  recipeForm: FormGroup;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.editMode = params.id != null;
      this.initForm();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(
        new RecipesActions.UpdateRecipe({
          id: this.id,
          updatedRecipe: this.recipeForm.value
        })
      );
    } else {
      const newRecipe = new Recipe(
        -1,
        this.recipeForm.value.name,
        this.recipeForm.value.description,
        this.recipeForm.value.imagePath,
        this.recipeForm.value.ingredients
      );
      this.store.dispatch(new RecipesActions.AddRecipe(newRecipe));
    }
    this.onCancel();
  }

  onIngredientAdd() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  get ingredientControls(): AbstractControl[] {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImage = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);
    if (this.editMode) {
      this.subscription = this.store
        .select(_ => _.recipes)
        .pipe(
          map(recipesState =>
            recipesState.recipes.find(recipe => recipe.id === this.id)
          )
        )
        .subscribe(recipe => {
          const { name, description, imagePath, ingredients } = recipe;
          recipeName = name;
          recipeDescription = description;
          recipeImage = imagePath;
          if (ingredients) {
            for (const ingredient of ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImage, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }
}
